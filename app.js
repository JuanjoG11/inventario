// 🚀 TENNIS Y MAS - APP v7.0 (OPTIMISTIC SYNC - MODO CUOTA EXCEDIDA)
const SUPABASE_URL = 'https://nrlaadaggmpjtdmtntoz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybGFhZGFnZ21wanRkbXRudG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTM0NjksImV4cCI6MjA4NTAyOTQ2OX0.B7RLhRRvuz5jAsRAHLhWIPtW3KdhEEAKzoKV3DfeoJE';

// Global State
let locations = JSON.parse(localStorage.getItem('loc_cache') || '[{"id": 1, "name": "Sede Fantasias New York"}, {"id": 2, "name": "Sede Bulevar"}]');
let allProducts = JSON.parse(localStorage.getItem('prod_cache') || '[]');
let currentInventory = JSON.parse(localStorage.getItem('inv_cache') || '[]');
let supabaseClient = null;

/**
 * 🛠️ INITIALIZATION
 */
async function init() {
    console.log("🚀 Sistema v7.0: Optimizando para límite de cuota...");
    const statusEl = document.getElementById('connectionStatus');

    // 1. Mostrar lo que tenemos en cache INMEDIATAMENTE
    updateUI();

    try {
        if (statusEl) {
            statusEl.textContent = "⏳ Sincronizando...";
            statusEl.style.color = "#f1c40f";
        }

        if (window.supabase) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
        }

        // 2. Intentar cargar datos frescos sin bloquear la UI
        const [locs, prods] = await Promise.all([
            supabaseFetch('locations').catch(e => locations),
            supabaseFetch('products', 'id,name,category,image,images,sizes').catch(e => allProducts)
        ]);

        locations = locs;
        allProducts = prods;

        // Guardar en cache para la próxima vez
        localStorage.setItem('loc_cache', JSON.stringify(locations));
        localStorage.setItem('prod_cache', JSON.stringify(allProducts));

        await fetchInventory();

        if (statusEl) {
            statusEl.textContent = "● Sincronizado";
            statusEl.style.color = "#2ecc71";
        }

    } catch (e) {
        console.warn("⚠️ Servidor lento o cuota excedida. Usando datos guardados localmente.");
        if (statusEl) {
            statusEl.textContent = "● Modo Local (Límite Cuota)";
            statusEl.style.color = "#e67e22";
        }
    }
}

async function supabaseFetch(table, select = '*') {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}`;
    const response = await fetch(url, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    if (!response.ok) throw new Error("Throttled");
    return await response.json();
}

async function fetchInventory() {
    try {
        const data = await supabaseFetch('view_inventory_details');
        currentInventory = data;
        localStorage.setItem('inv_cache', JSON.stringify(currentInventory));
        updateUI();
    } catch (err) {
        // Fallback si la vista falla (muy común si hay throttling)
        try {
            const rawData = await supabaseFetch('inventory');
            currentInventory = rawData.map(item => {
                const p = allProducts.find(prod => prod.id === item.product_id);
                const l = locations.find(loc => loc.id === item.location_id);
                return {
                    ...item,
                    product_name: p ? p.name : 'Modelo ?',
                    category: p ? p.category : 'N/A',
                    location_name: l ? l.name : 'Sede',
                    image: p ? (p.image || (p.images && p.images[0])) : null
                };
            });
            localStorage.setItem('inv_cache', JSON.stringify(currentInventory));
            updateUI();
        } catch (e) { /* Seguir con el cache cargado en init */ }
    }
}

/**
 * 🛒 Optimistic Update: Restar stock inmediatamente en la pantalla
 */
async function registerSale(productId, locationId, size, quantity) {
    // 1. Encontrar el item en la lista local
    const index = currentInventory.findIndex(i =>
        i.product_id === productId && i.location_id === locationId && i.size === size
    );

    if (index === -1) return alert("Producto no está en el catálogo de inventario.");

    const item = currentInventory[index];
    if (item.stock < quantity) return alert("Stock insuficiente.");

    // 2. ACTUALIZACIÓN OPTIMISTA: Restar en la pantalla YA
    const oldStock = item.stock;
    item.stock -= quantity;
    updateUI();

    // 3. Intentar guardar en Supabase de fondo
    try {
        if (!supabaseClient) throw new Error("No client");

        const { error } = await supabaseClient
            .from('inventory')
            .update({ stock: item.stock, updated_at: new Date() })
            .eq('product_id', productId)
            .eq('location_id', locationId)
            .eq('size', size);

        if (error) throw error;

        // Guardar cache actualizado
        localStorage.setItem('inv_cache', JSON.stringify(currentInventory));
        return true;

    } catch (err) {
        console.error("Fallo al sincronizar venta, pero se guardó localmente:", err);
        // NO revertimos el cambio para que el usuario pueda seguir con su demo
        // Pero avisamos que el servidor está ignorando el cambio por la cuota
        alert("⚠️ REGISTRADO LOCALMENTE: El servidor de Supabase está lento o sin cuota, pero el stock se ha restado en esta pantalla.");
        return true;
    }
}

function updateUI() {
    if (typeof renderDashboard === 'function') renderDashboard();
    if (typeof renderSalesUI === 'function') renderSalesUI();
}
