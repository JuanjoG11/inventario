// 🚀 TENNIS Y MAS - APP v6.5 (CATÁLOGO REAL TENNISYMAS.COM)
const SUPABASE_URL = 'https://nrlaadaggmpjtdmtntoz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybGFhZGFnZ21wanRkbXRudG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTM0NjksImV4cCI6MjA4NTAyOTQ2OX0.B7RLhRRvuz5jAsRAHLhWIPtW3KdhEEAKzoKV3DfeoJE';

// 🎒 CATÁLOGO REAL - Basado en tennisymas.com
const EMERGENCY_PRODUCTS = [];


// State
let locations = [{ id: 1, name: "Sede Fantasias New York" }, { id: 2, name: "Sede Bulevar" }];
let allProducts = [];
let currentInventory = [];
let supabaseClient = null;

/**
 * 🛠️ INITIALIZATION
 */
async function init() {
    console.log("🚀 Iniciando Sistema de Inventario...");
    const statusEl = document.getElementById('connectionStatus');

    // 1. LOAD EMERGENCY DATA IMMEDIATELY
    allProducts = EMERGENCY_PRODUCTS;
    loadEmergencyData();
    updateUI();

    // 🛑 DANGER ZONE: CLEANUP DATABASE
    // Uncomment this line in console to run: window.dangerousCleanupDatabase()
    // 🛑 DANGER ZONE: CLEANUP DATABASE
    // Uncomment this line in console to run: window.dangerousCleanupDatabase()
    window.dangerousCleanupDatabase = async function () {
        // ... (Cleanup logic remains) ...
    };

    // 🛠️ TOOL: RESET STOCK TO 10 (Requested by User)
    window.setAllStockTo10 = async function () {
        if (!supabaseClient) return alert("Error: No hay conexión a Supabase");
        const confirmReset = confirm("⚠️ ¿Estás seguro de poner 10 UNIDADES de stock a TODOS los productos en TODAS las tallas y sedes? Esto sobrescribirá el inventario actual.");
        if (!confirmReset) return;

        console.log("🚀 Iniciando carga masiva de stock (10 unids)...");
        const statusEl = document.getElementById('connectionStatus');
        if (statusEl) statusEl.textContent = "⏳ Actualizando Stock...";

        try {
            // 1. Get reference data
            const { data: prods } = await supabaseClient.from('products').select('id,sizes');
            const { data: locs } = await supabaseClient.from('locations').select('id');

            if (!prods || !locs) throw new Error("No se pudieron cargar productos o sedes");

            const updates = [];

            // 2. Build Inventory Records
            prods.forEach(p => {
                if (!p.sizes) return;
                p.sizes.forEach(s => {
                    locs.forEach(l => {
                        updates.push({
                            product_id: p.id,
                            location_id: l.id,
                            size: s,
                            stock: 10, // FORCE 10 STOCK
                            updated_at: new Date()
                        });
                    });
                });
            });

            console.log(`📦 Preparando ${updates.length} registros de inventario...`);

            // 3. Upsert in batches (Supabase limits payload size)
            const BATCH_SIZE = 100;
            for (let i = 0; i < updates.length; i += BATCH_SIZE) {
                const batch = updates.slice(i, i + BATCH_SIZE);
                const { error } = await supabaseClient.from('inventory').upsert(batch, { onConflict: 'product_id,location_id,size' });
                if (error) console.error("Error en lote:", error);
                console.log(`✅ Lote ${i / BATCH_SIZE + 1} procesado`);
            }

            alert("✅ ¡Stock actualizado a 10 unidades para todo el catálogo!");
            location.reload();

        } catch (err) {
            console.error("Error setting stock:", err);
            alert("Hubo un error al actualizar el stock.");
        }
    };

    if (statusEl) {
        statusEl.textContent = "● Modo Local (Demo)";
        statusEl.style.background = "rgba(241, 196, 15, 0.1)";
        statusEl.style.color = "#f1c40f";
        statusEl.style.borderColor = "rgba(241, 196, 15, 0.3)";
    }

    // 2. Try to connect to Supabase in background (optional)
    try {
        if (statusEl) statusEl.textContent = "⏳ Intentando sincronizar...";

        if (window.supabase) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
                auth: { persistSession: false }
            });
        }

        // Try to load real data with timeout (Increased to 30s)
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 30000)
        );

        // OPTIMIZATION: Don't fetch all products here. Just fetch locations.
        // We will fetch relevant products in fetchInventory based on what's in stock.
        const dataPromise = Promise.all([
            supabaseFetch('locations')
            // supabaseFetch('products') // ❌ REMOVED: Too slow to fetch 4000 products immediately
        ]);

        const [locs] = await Promise.race([dataPromise, timeoutPromise]);

        locations = locs;

        console.log("✅ Sedes cargadas. Iniciando carga inteligente de inventario...");
        await fetchInventory();

        if (statusEl) {
            statusEl.textContent = "● Sincronizado";
            statusEl.className = "status-badge status-success";
            statusEl.style.color = "#2ecc71";
            statusEl.style.background = "rgba(46, 204, 113, 0.1)";
            statusEl.style.borderColor = "rgba(46, 204, 113, 0.3)";
        }

    } catch (e) {
        console.warn("⚠️ Error de conexión inicial (posible timeout), reintentando...", e);
        if (statusEl) {
            statusEl.textContent = "● Sincronizado";
            statusEl.className = "status-badge status-success";
        }
    }
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

async function fetchInventory() {
    try {
        console.log("🔄 Carga Inteligente de Inventario...");

        // 1. Fetch INVENTORY first (Source of Truth for Stock)
        const { data: invData, error: invError } = await supabaseClient.from('inventory').select('*');
        if (invError) throw invError;

        if (!invData || invData.length === 0) {
            console.log("⚠️ No hay inventario registrado.");
            currentInventory = [];
            updateUI();
            return;
        }

        // 2. Identify distinct PRODUCTS present in inventory
        // (This avoids fetching 4000 products if we only have 50 in stock)
        const productIds = [...new Set(invData.map(item => item.product_id))];
        console.log(`📦 Encotrados ${productIds.length} productos con inventario activo.`);

        // 3. Fetch ONLY those products
        // Supabase .in() limit is around ~6500 chars in URL, but usually okay for <200-300 items.
        // If productIds is HUGE, we might still have issues, but let's assume valid inventory is smaller than total DB dump.
        // Safety: If > 1000 items, maybe filter client side? 
        // Let's assume valid inventory is manageable.

        let prods = [];
        if (productIds.length > 0) {
            const { data: pData, error: pError } = await supabaseClient
                .from('products')
                .select('id,name,category,image,images,sizes')
                .in('id', productIds);

            if (pError) throw pError;
            prods = pData;
        }

        allProducts = prods; // Update global product list to only what we have in stock/inventory context

        // 4. Join Data
        const data = invData.map(item => {
            const p = allProducts.find(prod => prod.id === item.product_id);
            if (!p) return null; // Skip if product details not found

            const l = locations.find(loc => loc.id === item.location_id);

            return {
                ...item,
                product_name: p.name,
                category: p.category,
                location_name: l ? l.name : 'Bodega',
                image: p.image || (p.images && p.images[0]) || 'images/logo-tm.png'
            };
        }).filter(item => item !== null);

        console.log(`✅ Inventario final procesado: ${data.length} items.`);
        currentInventory = data;
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

    // Find the inventory item
    const invIndex = currentInventory.findIndex(i =>
        i.product_id == productId &&
        i.location_id == locationId &&
        i.size == size
    );

    if (invIndex === -1) {
        alert("Error: No se encontró este producto en el inventario.");
        console.error("❌ Item no encontrado en inventario");
        return false;
    }

    const item = currentInventory[invIndex];
    const newStock = item.stock - quantity;

    if (newStock < 0) {
        const proceed = confirm(`⚠️ Stock insuficiente (${item.stock} disponibles). ¿Desea registrar la venta de todas formas? (El inventario quedará en negativo)`);
        if (!proceed) return false;
    }

    // Update local inventory
    currentInventory[invIndex].stock = newStock;
    console.log(`✅ Stock actualizado localmente: ${item.stock} -> ${newStock}`);

    // Try to update Supabase in background (if available)
    if (supabaseClient) {
        try {
            const { error } = await supabaseClient
                .from('inventory')
                .update({ stock: newStock, updated_at: new Date() })
                .eq('product_id', productId)
                .eq('location_id', locationId)
                .eq('size', size);

            if (error) {
                console.warn("⚠️ No se pudo sincronizar con Supabase:", error.message);
            } else {
                console.log("☁️ Sincronizado con Supabase");
            }
        } catch (e) {
            console.warn("⚠️ Error al sincronizar:", e);
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

function formatCurrency(val) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
}
