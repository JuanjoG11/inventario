// 🚀 TENNIS Y MAS - APP v6.0 (MODO REAL & INTEGRADO)
const SUPABASE_URL = 'https://nrlaadaggmpjtdmtntoz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybGFhZGFnZ21wanRkbXRudG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTM0NjksImV4cCI6MjA4NTAyOTQ2OX0.B7RLhRRvuz5jAsRAHLhWIPtW3KdhEEAKzoKV3DfeoJE';

// State
let locations = [];
let allProducts = [];
let currentInventory = [];
let supabaseClient = null;

/**
 * 🛠️ INITIALIZATION
 */
async function init() {
    console.log("🚀 Iniciando Sistema de Inventario Real...");
    const statusEl = document.getElementById('connectionStatus');

    try {
        if (statusEl) statusEl.textContent = "⏳ Sincronizando...";

        // 1. Initialize Supabase Library (Preferred)
        if (window.supabase) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
                auth: { persistSession: false }
            });
        }

        // 2. Load Core Data
        const [locs, prods] = await Promise.all([
            supabaseFetch('locations'),
            supabaseFetch('products', 'id,name,category,image,images,sizes')
        ]);

        locations = locs;
        allProducts = prods;

        // 3. Load Real Inventory
        await fetchInventory();

        if (statusEl) {
            statusEl.textContent = "● Sincronizado";
            statusEl.style.color = "#2ecc71";
        }

    } catch (e) {
        console.error("❌ Init Error:", e);
        if (statusEl) {
            statusEl.textContent = "⚠️ Error de Red";
            statusEl.style.color = "#ff3333";

            // Add a manual retry button if it fails
            if (!document.getElementById('retryBtn')) {
                const btn = document.createElement('button');
                btn.id = 'retryBtn';
                btn.textContent = "REINTENTAR CONEXIÓN";
                btn.style = "background: #ff3333; color: white; border: none; padding: 5px 10px; border-radius: 5px; font-size: 0.7rem; cursor: pointer; margin-left: 10px;";
                btn.onclick = () => window.location.reload();
                statusEl.parentElement.appendChild(btn);
            }
        }
    }
}

/**
 * 🛰️ DATA FETCHING
 */
async function supabaseFetch(table, select = '*') {
    // Try via library first
    if (supabaseClient) {
        const { data, error } = await supabaseClient.from(table).select(select);
        if (!error && data) return data;
    }

    // Fallback to fetch
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
        // Try view first, then raw table
        let data;
        try {
            data = await supabaseFetch('view_inventory_details');
        } catch (e) {
            data = await supabaseFetch('inventory');
            // If raw table, we need to map names manually
            data = data.map(item => {
                const p = allProducts.find(prod => prod.id === item.product_id);
                const l = locations.find(loc => loc.id === item.location_id);
                return {
                    ...item,
                    product_name: p ? p.name : 'Unknown',
                    category: p ? p.category : 'N/A',
                    location_name: l ? l.name : 'Bodega',
                    image: p ? (p.image || (p.images && p.images[0])) : null
                };
            });
        }

        currentInventory = data;
        updateUI();
    } catch (err) {
        console.error("Fetch Inventory Error", err);
    }
}

/**
 * 🛒 SALES REGISTRATION (The "REAL" Part)
 */
async function registerSale(productId, locationId, size, quantity) {
    if (!supabaseClient) {
        alert("Error: No hay conexión con el servidor.");
        return;
    }

    // 1. Get current stock
    const { data: currentEntry, error: fetchError } = await supabaseClient
        .from('inventory')
        .select('id, stock')
        .eq('product_id', productId)
        .eq('location_id', locationId)
        .eq('size', size)
        .single();

    if (fetchError || !currentEntry) {
        alert("Error: No se encontró este producto en el inventario.");
        return;
    }

    const newStock = currentEntry.stock - quantity;
    if (newStock < 0) {
        alert("Error: No hay suficiente stock físico.");
        return;
    }

    // 2. Update Stock
    const { error: updateError } = await supabaseClient
        .from('inventory')
        .update({ stock: newStock, updated_at: new Date() })
        .eq('id', currentEntry.id);

    if (updateError) {
        alert("Error al registrar: " + updateError.message);
    } else {
        await fetchInventory(); // Refresh Dashboard/UI
        return true;
    }
}

function updateUI() {
    if (typeof renderDashboard === 'function') renderDashboard();
    if (typeof renderSalesUI === 'function') renderSalesUI();
}

function formatCurrency(val) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
}
