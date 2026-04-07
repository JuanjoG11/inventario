// 🚀 TENNIS Y MAS - APP v6.5 (CATÁLOGO REAL TENNISYMAS.COM)
const SUPABASE_URL = 'https://shbtmkeyarqppasdpzxv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYnRta2V5YXJxcHBhc2Rwenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjEzODQsImV4cCI6MjA4NzQzNzM4NH0.Z4Bqo7NHUNs736UBbSG79OEwXEPQvG9ZUrgemLEquGQ';

// 🎒 CATÁLOGO REAL - Basado en tennisymas.com
const EMERGENCY_PRODUCTS = [];


// State
let locations = [
    { id: 1, name: "Sede Fantasias New York", pin: "1111" },
    { id: 2, name: "Sede Bulevar", pin: "2222" },
    { id: 3, name: "Sede Virtual", pin: "3333" }
];
let activeLocationId = parseInt(localStorage.getItem('active_location_id') || '0'); // 0 means not logged in
let isLoggedIn = localStorage.getItem('is_logged_in') === 'true';
let allProducts = [];
let currentInventory = [];
let supabaseClient = null;
const GLOBAL_STOCK_LOCATION_ID = 0; // The ID used in 'inventory' table for the shared pool

/**
 * 🛠️ INITIALIZATION
 */
async function init() {
    console.log("🚀 Iniciando Sistema de Inventario...");
    const statusEl = document.getElementById('connectionStatus');

    // 0. CLEAR OLD CACHE
    console.log("🧹 Limpiando caché antiguo...");
    localStorage.removeItem('elite_inventory_cache');
    localStorage.removeItem('elite_products_cache');

    // 1. Show login or load UI
    if (isLoggedIn && activeLocationId > 0) {
        document.body.classList.remove('login-required');
        updateUI(); // Show empty state while loading
    } else {
        showLoginScreen();
    }

    // 2. Initialize Supabase Client
    if (window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
            auth: { persistSession: false }
        });
    }

    // 3. Try to sync with Supabase
    try {
        if (statusEl) {
            statusEl.textContent = "● Sincronizando...";
            statusEl.style.background = "rgba(52, 152, 219, 0.1)";
            statusEl.style.color = "#3498db";
            statusEl.style.borderColor = "rgba(52, 152, 219, 0.3)";
        }

        await fetchInventory();
        
        // 4. Set up Realtime Subscriptions
        setupRealtime();

        if (statusEl) {
            statusEl.textContent = "● Sincronizado";
            statusEl.className = "status-badge status-success";
            statusEl.style.color = "#2ecc71";
            statusEl.style.background = "rgba(46, 204, 113, 0.1)";
            statusEl.style.borderColor = "rgba(46, 204, 113, 0.3)";
        }

    } catch (e) {
        console.warn("⚠️ Hubo un problema al sincronizar. Usando datos de respaldo:", e);
        if (statusEl) {
            statusEl.textContent = "● Error Sincro";
            statusEl.className = "status-badge status-warning";
            statusEl.style.color = "#f39c12";
            statusEl.style.background = "rgba(243, 156, 18, 0.1)";
            statusEl.style.borderColor = "rgba(243, 156, 18, 0.3)";
        }
    }
}

/**
 * 🛠️ SILENT AUTO-RESTORE
 */
async function silentRestoreCatalog() {
    console.log("Silent restore catalog is deprecated.");
}

/**
 * 🛰️ REALTIME SYNCHRONIZATION
 * Listen for changes on inventory and products tables to keep sessions synced.
 */
function setupRealtime() {
    if (!supabaseClient) return;

    console.log("📡 Suscribiendo a cambios en tiempo real...");

    // 1. Inventory Changes (Web <--> Local Sales)
    supabaseClient
        .channel('inventory_sync')
        .on('postgres_changes', { event: '*', table: 'inventory', schema: 'public' }, async (payload) => {
            console.log('🔄 Cambio en Inventario detectado:', payload.eventType);
            // Re-fetch entire inventory to ensure UI state is consistent
            await fetchInventory();
            if (typeof updateUI === 'function') updateUI();
            if (typeof window.showToast === 'function') window.showToast('Inventario actualizado (Venta Web/Bodega)', 'info');
        })
        .subscribe();

    // 2. Product Metadata Changes (New categories/images/sizes)
    supabaseClient
        .channel('product_sync')
        .on('postgres_changes', { event: '*', table: 'products', schema: 'public' }, async (payload) => {
            console.log('🔄 Cambio en Productos detectado:', payload.eventType);
            await fetchInventory();
            if (typeof updateUI === 'function') updateUI();
            if (typeof window.showToast === 'function') window.showToast('Catálogo actualizado automáticamente', 'info');
        })
        .subscribe();
}

/**
 * 🛰️ DATA FETCHING
 */
async function supabaseFetch(table, select = '*') {
    if (supabaseClient) {
        const { data, error } = await supabaseClient.from(table).select(select);
        if (!error && data) return data;
    }

    const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}`;
    const response = await fetch(url, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    });

    if (!response.ok) throw new Error(`Error en ${table}`);
    return await response.json();
}

/**
 * 📦 FETCH INVENTORY FROM SUPABASE
 */
async function fetchInventory() {
    try {
        console.log("🔄 Sincronizando Catálogo Dinámico...");

        if (supabaseClient) {
            // 1. Fetch ALL products from the database (The "Web" catalog)
            const { data: pData, error: pError } = await supabaseClient
                .from('products')
                .select('id,name,category,image,images,sizes');

            if (pError) throw pError;

            // Update the global catalog with fresh data from DB and apply smart match for images
            allProducts = pData.map(p => {
                let pImage = p.image;
                let pCat = p.category;

                // Smart Matcher for Bodega Aliases
                if (!pImage || pImage === 'images/logo-tm.png') {
                    const lowName = p.name.toLowerCase();
                    let matchedRef = null;

                    if (typeof TENNISYMAS_PRODUCTS !== 'undefined') {
                        if (lowName.includes('mercurial') || lowName.includes('vapor')) {
                            matchedRef = TENNISYMAS_PRODUCTS.find(c => c.name.toLowerCase().includes('mercurial'));
                        } else if (lowName.includes('predator')) {
                            matchedRef = TENNISYMAS_PRODUCTS.find(c => c.name.toLowerCase().includes('predator'));
                        } else if (lowName.includes('f50') || lowName.includes('crazyfast')) {
                            matchedRef = TENNISYMAS_PRODUCTS.find(c => c.name.toLowerCase().includes('crazyfast') || c.name.toLowerCase().includes('x speedportal'));
                        } else if (lowName.includes('phantom') || lowName.includes('gx')) {
                            matchedRef = TENNISYMAS_PRODUCTS.find(c => c.name.toLowerCase().includes('phantom'));
                        } else if (lowName.includes('gato') || lowName.includes('lunar') || lowName.includes('supremo') || lowName.includes('street')) {
                            matchedRef = TENNISYMAS_PRODUCTS.find(c => c.name.toLowerCase().includes('gato'));
                        } else if (lowName.includes('tiempo')) {
                            matchedRef = TENNISYMAS_PRODUCTS.find(c => c.name.toLowerCase().includes('tiempo'));
                        } else if (lowName.includes('mizuno')) {
                            pCat = 'Futsal'; // Default for mizuno for now
                        } else if (lowName.includes('joma')) {
                            pCat = 'Futsal';
                            matchedRef = TENNISYMAS_PRODUCTS.find(c => c.name.toLowerCase().includes('sala'));
                        } else if (lowName.includes('peto')) {
                            pCat = 'Petos';
                        } else if (lowName.includes('camiseta')) {
                            pCat = 'Camisetas';
                        }
                    }

                    if (matchedRef) {
                        pImage = matchedRef.image || pImage;
                        pCat = matchedRef.category || pCat;
                    }
                }

                // Enforce category by explicit naming conventions (Improved Order)
                const lowName = p.name.toLowerCase();
                if (lowName.includes('niño') || lowName.includes(' jr') || lowName.includes('niña')) {
                    pCat = 'Niños';
                } else if (lowName.includes('futsal') || lowName.includes('tf') || lowName.includes('sala')) {
                    pCat = 'Futsal';
                } else if ((lowName.includes('teni') || lowName.includes('tenis')) && lowName.includes('guayo')) {
                    pCat = 'Tenis-Guayos';
                } else if (lowName.includes('guayo') || lowName.includes('fg')) {
                    pCat = 'Guayos';
                } else if (lowName.includes('peto')) {
                    pCat = 'Petos';
                } else if (lowName.includes('camiseta') || lowName.includes('camisa')) {
                    pCat = 'Camisetas';
                }

                let parsedSizes = [];
                try {
                    parsedSizes = typeof p.sizes === 'string' ? JSON.parse(p.sizes) : (p.sizes || []);
                } catch (e) {
                    console.warn(`⚠️ Error parseando tallas para ${p.name}:`, p.sizes);
                    // Fallback: si es una cadena separada por comas
                    if (typeof p.sizes === 'string') {
                        parsedSizes = p.sizes.split(',').map(s => s.trim());
                    }
                }

                return {
                    ...p,
                    image: pImage,
                    category: pCat || 'Deportivo',
                    sizes: Array.isArray(parsedSizes) ? parsedSizes : []
                };
            });

            console.log(`📦 Catálogo cargado: ${allProducts.length} productos.`);

            // 2. Fetch ALL inventory records
            const { data: invData, error: invError } = await supabaseClient
                .from('inventory')
                .select('*');

            if (invError) throw invError;

            rawInventory = invData;

            // 3. Construct Complete Inventory (Shared Pool)
            let fullInventory = [];
            const namesSeen = new Set();
            const uniqueProducts = allProducts.filter(p => {
                if (namesSeen.has(p.name)) return false;
                namesSeen.add(p.name);
                return true;
            });

            uniqueProducts.forEach(product => {
                let productSizes = Array.isArray(product.sizes) ? product.sizes : [];
                
                if (productSizes.length === 0) {
                    productSizes = ['Única'];
                }

                productSizes.forEach(size => {
                    const sizeKey = size.toString();
                    
                    // Get all records for this product/size across all locations
                    const records = rawInventory.filter(i =>
                        i.product_id == product.id &&
                        i.size == sizeKey
                    );
                    
                    if (records.length === 0) {
                        // Create a placeholder if no record exists
                        fullInventory.push({
                            id: null,
                            product_id: product.id,
                            product_name: product.name,
                            category: product.category,
                            location_id: 0,
                            location_name: "Stock Global",
                            size: sizeKey,
                            stock: 0,
                            image: product.image
                        });
                    } else {
                        // Push all existing locations for this product/size
                        records.forEach(r => {
                            const location = locations.find(l => l.id == r.location_id);
                            fullInventory.push({
                                ...r,
                                product_name: product.name,
                                category: product.category,
                                location_name: location ? location.name : "Sede Desconocida",
                                image: product.image
                            });
                        });
                    }
                });
            });

            currentInventory = fullInventory;
            console.log(`📡 Inventario procesado: ${currentInventory.length} registros (por sede/talla).`);

            if (supabaseClient) {
                updateUI();
            } else {
                loadEmergencyData();
            }
        }

        updateUI();

    } catch (err) {
        console.error("❌ Error en Sincronización:", err);
        throw err;
    }
}

/**
 * 🛒 SALES REGISTRATION (SMART LOCATION SUBTRACTION)
 * Subtracts from the active location first, then from others if needed (Global Pool)
 */
async function registerSale(productId, activeLocId, size, quantity) {
    console.log(`🛒 Venta: Prod ${productId}, Sede ${activeLocId}, Talla ${size}, Qty ${quantity}`);

    if (supabaseClient) {
        try {
            // 1. Get ALL records for this product/size
            const { data: records, error: fetchErr } = await supabaseClient
                .from('inventory')
                .select('*')
                .eq('product_id', productId)
                .eq('size', size);
            
            if (fetchErr) throw fetchErr;

            // 2. Identify target record (Priority: 1. Active Loc, 2. Global (0), 3. Any other)
            let remaining = quantity;
            const sortedRecords = records.sort((a, b) => {
                if (a.location_id == activeLocId) return -1;
                if (b.location_id == activeLocId) return 1;
                if (a.location_id == 0) return -1;
                if (b.location_id == 0) return 1;
                return 0;
            });

            for (const record of sortedRecords) {
                if (remaining <= 0) break;
                
                const take = Math.min(record.stock || 0, remaining);
                if (take > 0) {
                    const newStock = record.stock - take;
                    remaining -= take;

                    await supabaseClient
                        .from('inventory')
                        .update({ stock: newStock, updated_at: new Date() })
                        .eq('id', record.id);
                        
                    console.log(`✅ Descontados ${take} de Sede ${record.location_id}. Restante: ${remaining}`);
                }
            }

            // 3. Fallback: If still remaining, subtract from Global pool (id: 0) even if it goes negative (for accounting)
            if (remaining > 0) {
                const globalRec = records.find(r => r.location_id == 0);
                if (globalRec) {
                    await supabaseClient
                        .from('inventory')
                        .update({ stock: globalRec.stock - remaining, updated_at: new Date() })
                        .eq('id', globalRec.id);
                } else {
                    // Create it
                    await supabaseClient
                        .from('inventory')
                        .insert({
                            product_id: productId,
                            location_id: 0,
                            size: size,
                            stock: -remaining,
                            updated_at: new Date()
                        });
                }
                console.log(`⚠️ Se descontaron ${remaining} adicionales del Stock Global (Negativo).`);
            }

            await fetchInventory();
            return true;
        } catch (e) {
            console.warn("⚠️ Error Sincro Venta:", e);
            return false;
        }
    }

    updateUI();
    return true;
}

function loadEmergencyData() {
    console.log("📦 Cargando catálogo...");

    // STRICT: Always prefer official catalog
    if (typeof TENNISYMAS_PRODUCTS !== 'undefined') {
        allProducts = TENNISYMAS_PRODUCTS;
    } else {
        allProducts = EMERGENCY_PRODUCTS;
    }

    // Generate inventory (Shared Pool)
    currentInventory = [];
    allProducts.forEach(product => {
        product.sizes.forEach(size => {
            currentInventory.push({
                product_id: product.id,
                product_name: product.name,
                category: product.category,
                image: product.image,
                location_id: 0,
                location_name: "Stock Global",
                size: size.toString(),
                stock: 3
            });
        });
    });
    console.log(`✅ ${currentInventory.length} items de inventario cargados.`);
}

function updateUI() {
    if (typeof renderDashboard === 'function') renderDashboard();
    if (typeof renderSalesUI === 'function') renderSalesUI();
}

async function logTransaction(type, productName, size, sedeIdOrName, qty) {
    // Convert sede ID to name if it's a number
    let sedeName = sedeIdOrName;
    if (typeof sedeIdOrName === 'number' || !isNaN(sedeIdOrName)) {
        const location = locations.find(l => l.id == sedeIdOrName);
        sedeName = location ? location.name : sedeIdOrName;
    }

    // FIXED KEY: transaction_history instead of transaction_log
    const history = JSON.parse(localStorage.getItem('transaction_history') || '[]');
    history.unshift({
        type,
        product: productName,
        size,
        sede: sedeName,
        qty,
        date: new Date().toISOString() // Using 'date' for renderHistory compatibility
    });
    localStorage.setItem('transaction_history', JSON.stringify(history.slice(0, 100))); // Keep last 100
}

async function verifyPin(pin) {
    const sede = locations.find(l => l.pin === pin);
    if (sede) {
        activeLocationId = sede.id;
        isLoggedIn = true;
        localStorage.setItem('active_location_id', activeLocationId);
        localStorage.setItem('is_logged_in', 'true');

        document.body.classList.remove('login-required');
        const loginOverlay = document.getElementById('loginOverlay');
        if (loginOverlay) loginOverlay.style.display = 'none';

        showToast(`Bienvenido a ${sede.name}`, 'success');

        // Populate selectors now that we have a sede
        if (typeof populateProfileSelectors === 'function') populateProfileSelectors();

        await fetchInventory();
        return true;
    } else {
        return false;
    }
}

function showLoginScreen() {
    document.body.classList.add('login-required');
    const loginOverlay = document.getElementById('loginOverlay');
    if (loginOverlay) loginOverlay.style.display = 'flex';
}

function logout() {
    localStorage.removeItem('is_logged_in');
    localStorage.removeItem('active_location_id');
    location.reload();
}

window.verifyPin = verifyPin;
window.logout = logout;
window.showLoginScreen = showLoginScreen;

// DATABASE CLEANUP UTILITY
window.dangerousCleanupDatabase = async function () {
    if (!confirm('¿Estás SEGURO de que quieres limpiar productos NO oficiales de la base de datos? Esta acción NO se puede deshacer.')) return;

    try {
        if (!supabaseClient) {
            alert('No hay conexión a Supabase');
            return;
        }

        // Get all products from DB
        const { data: allDBProducts, error: fetchError } = await supabaseClient
            .from('products')
            .select('id, name');

        if (fetchError) throw fetchError;

        const officialIds = TENNISYMAS_PRODUCTS.map(p => p.id);
        const toDelete = allDBProducts.filter(p => !officialIds.includes(p.id));

        if (toDelete.length === 0) {
            alert('✅ La base de datos ya está limpia. Solo contiene productos oficiales.');
            return;
        }

        console.log(`🗑️ Eliminando ${toDelete.length} productos no oficiales...`);

        for (const prod of toDelete) {
            // Delete from inventory first
            await supabaseClient.from('inventory').delete().eq('product_id', prod.id);
            // Then delete product
            await supabaseClient.from('products').delete().eq('id', prod.id);
        }

        alert(`✅ Limpieza completada. Se eliminaron ${toDelete.length} productos no oficiales.`);
        location.reload();
    } catch (err) {
        console.error('Error en limpieza:', err);
        alert('❌ Error al limpiar: ' + err.message);
    }
};

function formatCurrency(val) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
}
