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
        console.log("🔄 Sincronizando Catálogo Dinámico...");

        if (supabaseClient) {
            // 1. Fetch ALL products from the database (The "Web" catalog)
            const { data: pData, error: pError } = await supabaseClient
                .from('products')
                .select('id,name,category,image,images,sizes');

            if (pError) throw pError;

            // Update the global catalog with fresh data from DB
            allProducts = pData.map(p => ({
                ...p,
                sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : (p.sizes || [])
            }));

            console.log(`📦 Catálogo cargado: ${allProducts.length} productos.`);

            // 2. Fetch ALL inventory records
            const { data: invData, error: invError } = await supabaseClient
                .from('inventory')
                .select('*');

            if (invError) throw invError;

            rawInventory = invData;

            // 3. Construct Complete Inventory (Shared Pool)
            let fullInventory = [];

            allProducts.forEach(product => {
                const productSizes = Array.isArray(product.sizes) ? product.sizes : [];

                productSizes.forEach(size => {
                    // Find existing record in the GLOBAL pool (location_id: 0)
                    const existing = rawInventory.find(i =>
                        i.product_id == product.id &&
                        i.location_id == 0 &&
                        i.size == size.toString()
                    );

                    fullInventory.push({
                        id: existing ? existing.id : null,
                        product_id: product.id,
                        product_name: product.name,
                        category: product.category,
                        location_id: 0,
                        location_name: "Stock Global",
                        size: size.toString(),
                        stock: existing ? existing.stock : 0,
                        image: product.image || (product.images && product.images[0]) || 'images/logo-tm.png',
                        updated_at: existing ? existing.updated_at : null
                    });
                });
            });

            currentInventory = fullInventory;
            window.currentInventory = currentInventory;
            console.log(`✅ Inventario compartido procesado: ${currentInventory.length} variantes.`);

            currentInventory = fullInventory;
            window.currentInventory = currentInventory; // EXPOSE FOR DEBUG
            console.log(`✅ Inventario procesado: ${currentInventory.length} variantes totales.`);
        } else {
            // Fallback to local catalog if Supabase is not available
            if (typeof TENNISYMAS_PRODUCTS !== 'undefined') {
                allProducts = [...TENNISYMAS_PRODUCTS];
                loadEmergencyData(); // This fills currentInventory from TENNISYMAS_PRODUCTS
            }
        }

        updateUI();

    } catch (err) {
        console.error("❌ Error en Sincronización:", err);
        throw err;
    }
}

/**
 * 🛒 SALES REGISTRATION (GLOBAL POOL)
 */
async function registerSale(productId, locationId, size, quantity) {
    console.log(`🛒 Venta Global: Producto ${productId}, Talla ${size}, Cantidad ${quantity}`);

    const itemInCurrent = currentInventory.find(i =>
        i.product_id == productId &&
        i.size == size
    );

    let currentStock = itemInCurrent ? itemInCurrent.stock : 0;
    const newStock = currentStock - quantity;

    if (newStock < 0) {
        const proceed = confirm(`⚠️ Stock insuficiente (${currentStock} disponibles). ¿Desea registrar la venta de todas formas?`);
        if (!proceed) return false;
    }

    if (supabaseClient) {
        try {
            // ALWAYS update location_id: 0
            const { error } = await supabaseClient
                .from('inventory')
                .upsert({
                    product_id: productId,
                    location_id: 0,
                    size: size,
                    stock: newStock,
                    updated_at: new Date()
                }, { onConflict: 'product_id, location_id, size' });

            if (error) {
                console.warn("⚠️ Error Supabase:", error.message);
                return false;
            }
        } catch (e) {
            console.warn("⚠️ Error Sincro:", e);
            return false;
        }
    }

    const currentSales = parseInt(localStorage.getItem('today_sales_count') || '0');
    localStorage.setItem('today_sales_count', (currentSales + quantity).toString());

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
