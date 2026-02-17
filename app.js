// 🚀 TENNIS Y MAS - APP v6.5 (CATÁLOGO REAL TENNISYMAS.COM)
const SUPABASE_URL = 'https://nrlaadaggmpjtdmtntoz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybGFhZGFnZ21wanRkbXRudG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTM0NjksImV4cCI6MjA4NTAyOTQ2OX0.B7RLhRRvuz5jAsRAHLhWIPtW3KdhEEAKzoKV3DfeoJE';

// 🎒 CATÁLOGO REAL - Basado en tennisymas.com
const EMERGENCY_PRODUCTS = [];


// State
let locations = [
    { id: 1, name: "Sede Bulevar", pin: "1111" },
    { id: 2, name: "Sede Fantasías", pin: "2222" },
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

        if (statusEl) {
            statusEl.textContent = "● Sincronizado";
            statusEl.className = "status-badge status-success";
            statusEl.style.color = "#2ecc71";
            statusEl.style.background = "rgba(46, 204, 113, 0.1)";
            statusEl.style.borderColor = "rgba(46, 204, 113, 0.3)";
        }

    } catch (e) {
        console.warn("⚠️ Hubo un problema al sincronizar. Usando datos de respaldo.");
        if (statusEl) {
            statusEl.textContent = "● Modo Offline";
            statusEl.style.color = "#e67e22";
        }
    }
}

/**
 * 🛠️ SILENT AUTO-RESTORE
 */
async function silentRestoreCatalog() {
    // This function is no longer needed as products are loaded directly from DB.
    // Keeping it as a placeholder or removing it depends on future requirements.
    // For now, it will remain, but its call in init() has been removed.
    console.log("Silent restore catalog is deprecated.");
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
        let data = [];

        if (supabaseClient) {
            console.log("🔄 Carga Inteligente de Inventario...");

            // 1. Fetch ALL inventory from all locations
            const { data: invData, error: invError } = await supabaseClient
                .from('inventory')
                .select('*');

            if (invError) throw invError;

            rawInventory = invData; // Save raw data

            // 2. Extract unique product IDs
            const productIds = [...new Set(invData.map(item => item.product_id))];
            console.log(`📦 Encontrados ${productIds.length} productos en inventario.`);

            // 3. Fetch ALL products from database
            if (productIds.length > 0) {
                const { data: pData, error: pError } = await supabaseClient
                    .from('products')
                    .select('id,name,category,image,images,sizes');

                if (pError) throw pError;

                // Merge products into allProducts
                pData.forEach(spProd => {
                    const idx = allProducts.findIndex(p => p.id == spProd.id);
                    if (idx !== -1) {
                        allProducts[idx] = { ...allProducts[idx], ...spProd };
                    } else {
                        allProducts.push(spProd);
                    }
                });
            }

            // 4. Aggregate stock across all locations (sum by product + size)
            const stockMap = {};
            invData.forEach(item => {
                const key = `${item.product_id}_${item.size}`;
                if (!stockMap[key]) {
                    stockMap[key] = { ...item, stock: 0 };
                }
                stockMap[key].stock += item.stock;
            });

            // 5. Convert to array and add product info
            data = Object.values(stockMap).map(item => {
                const p = allProducts.find(prod => prod.id == item.product_id);
                if (!p) {
                    console.warn(`⚠️ Producto ${item.product_id} no encontrado en allProducts`);
                    return null;
                }

                return {
                    ...item,
                    product_name: p.name,
                    category: p.category,
                    location_name: 'Stock Total',
                    image: p.image || (p.images && p.images[0]) || 'images/logo-tm.png'
                };
            }).filter(item => item !== null);
        }

        // 5. Use inventory data directly
        currentInventory = data;

        console.log(`✅ Inventario cargado: ${currentInventory.length} items desde base de datos.`);
        console.log(`📊 Productos únicos: ${allProducts.length}`);

        // Debug: Show first 3 items
        if (currentInventory.length > 0) {
            console.log('🔍 Muestra de inventario:', currentInventory.slice(0, 3));
        }

        updateUI();

    } catch (err) {
        console.error("❌ Error en Carga Inteligente:", err);
    }
}

/**
 * 🛒 SALES REGISTRATION (Works in Local Mode)
 */
async function registerSale(productId, locationId, size, quantity) {
    console.log(`🛒 Registrando venta: Producto ${productId}, Sede ${locationId}, Talla ${size}, Cantidad ${quantity}`);

    // 1. Find the specific item record for the ACTIVE LOCATION
    const specificItem = rawInventory.find(i =>
        i.product_id == productId &&
        i.location_id == activeLocationId &&
        i.size == size
    );

    if (!specificItem) {
        alert("Error: No hay stock registrado en esta sede para este producto.");
        return false;
    }

    const newStock = specificItem.stock - quantity;

    if (newStock < 0) {
        const proceed = confirm(`⚠️ Stock insuficiente en sede (${specificItem.stock} disponibles). ¿Desea registrar la venta de todas formas? (El inventario quedará en negativo)`);
        if (!proceed) return false;
    }

    // 2. Update Supabase with the CORRECT new stock for this location
    if (supabaseClient) {
        try {
            const { error } = await supabaseClient
                .from('inventory')
                .update({ stock: newStock, updated_at: new Date() })
                .eq('product_id', productId)
                .eq('location_id', activeLocationId)
                .eq('size', size);

            if (error) {
                console.warn("⚠️ No se pudo sincronizar con Supabase:", error.message);
                return false;
            } else {
                console.log("☁️ Stock actualizado en Supabase");
            }
        } catch (e) {
            console.warn("⚠️ Error al sincronizar:", e);
            return false;
        }
    }

    // Increment daily sales counter
    const currentSales = parseInt(localStorage.getItem('today_sales_count') || '0');
    localStorage.setItem('today_sales_count', (currentSales + quantity).toString());

    // Update UI
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

    // Generate inventory for each product, size, and location
    currentInventory = [];
    allProducts.forEach(product => {
        product.sizes.forEach(size => {
            locations.forEach(location => {
                currentInventory.push({
                    product_id: product.id,
                    product_name: product.name,
                    category: product.category,
                    image: product.image,
                    location_id: location.id,
                    location_name: location.name,
                    size: size.toString(),
                    stock: Math.floor(Math.random() * 5) // Low random stock for demo
                });
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

    const log = JSON.parse(localStorage.getItem('transaction_log') || '[]');
    log.unshift({
        type,
        product: productName,
        size,
        sede: sedeName,
        qty,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('transaction_log', JSON.stringify(log.slice(0, 100))); // Keep last 100
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
