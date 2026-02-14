// 🚀 TENNIS Y MAS - APP v3.0 (EDICIÓN ESPEJO TIENDA)
const SUPABASE_URL = 'https://nrlaadaggmpjtdmtntoz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybGFhZGFnZ21wanRkbXRudG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTM0NjksImV4cCI6MjA4NTAyOTQ2OX0.B7RLhRRvuz5jAsRAHLhWIPtW3KdhEEAKzoKV3DfeoJE';

// Global State
let locations = [];
let allProducts = [];
let currentInventory = [];
let supabaseClient = null;

// Console Diagnostic v3.0
function logToScreen(msg, type = 'info') {
    console.log(`[v3.0] ${msg}`);
    const grid = document.getElementById('inventoryGrid');
    if (grid) {
        let debugBox = document.getElementById('debug-console');
        if (!debugBox) {
            debugBox = document.createElement('div');
            debugBox.id = 'debug-console';
            debugBox.style = "grid-column: 1/-1; background: #000; color: #0f0; padding: 20px; font-family: monospace; font-size: 0.8rem; border-radius: 12px; border: 1px solid #333; margin-bottom: 20px; white-space: pre-wrap; z-index: 1000;";
            debugBox.innerHTML = "<b>CONSOLA v3.0 (MODO COMPATIBILIDAD)</b><br>";
            grid.parentElement.insertBefore(debugBox, grid);
        }
        const color = type === 'error' ? '#ff3333' : (type === 'success' ? '#00ff00' : '#888');
        debugBox.innerHTML += `<span style="color: ${color}">[${new Date().toLocaleTimeString()}] ${msg}</span><br>`;
    }
}

/**
 * 🛠️ INITIALIZATION
 */
async function init() {
    logToScreen("🚀 Iniciando conexión segura...");
    const statusEl = document.getElementById('connectionStatus');

    // Safety check for local files
    if (window.location.protocol === 'file:') {
        logToScreen("⚠️ ERROR: Estas en archivo local. Usa: inventario.tennisymas.com", "error");
        return;
    }

    try {
        // 1. Initialize Client exactly like the shop
        if (window.supabase) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
                auth: { persistSession: false }
            });
            logToScreen("✅ Librería Supabase cargada.");
        }

        // 2. Load data sequentially (slower but more stable if throttled)
        logToScreen("Cargando sedes...");
        locations = await supabaseFetch('locations');

        logToScreen("Cargando catálogo...");
        allProducts = await supabaseFetch('products', 'id,name,category,image,images');

        logToScreen("Sincronizando existencias...");
        await fetchInventory();

        if (statusEl) {
            statusEl.textContent = "● Sincronizado";
            statusEl.style.color = "#2ecc71";
        }

        // Final celebration
        logToScreen("✨ Todo listo. Mostrando inventario.", "success");
        setTimeout(() => {
            const dbg = document.getElementById('debug-console');
            if (dbg && currentInventory.length > 0) dbg.style.display = 'none';
        }, 5000);

    } catch (e) {
        logToScreen(`🚨 FALLO: ${e.message}`, 'error');
        if (statusEl) {
            statusEl.textContent = "⚠️ Error de Red";
            statusEl.style.color = "#ff3333";
        }
    }
}

/**
 * 🛰️ SECURE FETCH (Sequential fallback)
 */
async function supabaseFetch(table, select = '*', timeoutMs = 25000) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}`;

    // Try Library first (if available)
    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient.from(table).select(select);
            if (!error && data) return data;
            logToScreen(`Librería falló en ${table}, reintentando con fetch...`, 'error');
        } catch (libErr) {
            logToScreen(`Error de librería en ${table}: ${libErr.message}`, 'error');
        }
    }

    // Manual Fetch Fallback (Mirrored headers)
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
                // Content-Type removed for GET to avoid preflights
            },
            signal: controller.signal
        });
        clearTimeout(timer);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        logToScreen(`✅ ${table} cargado: ${result.length} filas.`, 'success');
        return result;
    } catch (e) {
        clearTimeout(timer);
        if (e.name === 'AbortError') throw new Error(`Timeout en ${table} (Servidor no responde)`);
        throw e;
    }
}

async function fetchInventory() {
    try {
        // Use the view for detailed info
        const data = await supabaseFetch('view_inventory_details');
        currentInventory = data.map(item => {
            const prod = allProducts.find(p => p.id === item.product_id);
            let img = item.image || (prod ? (prod.image || (prod.images && prod.images[0])) : null);
            return { ...item, image: img };
        });
        updateUI();
    } catch (err) {
        logToScreen(`Usando tabla cruda (Fallback)...`, 'error');
        const rawData = await supabaseFetch('inventory');
        currentInventory = rawData.map(item => {
            const prod = allProducts.find(p => p.id === item.product_id);
            const loc = locations.find(l => l.id === item.location_id);
            return {
                ...item,
                product_name: prod ? prod.name : 'Unknown',
                category: prod ? prod.category : 'N/A',
                location_name: loc ? loc.name : 'Bodega',
                image: prod ? (prod.image || (prod.images && prod.images[0])) : null
            };
        });
        updateUI();
    }
}

function updateUI() {
    if (typeof renderDashboard === 'function') renderDashboard();
    if (typeof renderSalesUI === 'function') renderSalesUI();
}

function formatCurrency(val) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
}
