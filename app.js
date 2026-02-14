// 🚀 TENNIS Y MAS - APP v2.2 (DIAGNÓSTICO PROFUNDO)
const SUPABASE_URL = 'https://nrlaadaggmpjtdmtntoz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybGFhZGFnZ21wanRkbXRudG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTM0NjksImV4cCI6MjA4NTAyOTQ2OX0.B7RLhRRvuz5jAsRAHLhWIPtW3KdhEEAKzoKV3DfeoJE';

// State
let locations = [];
let allProducts = [];
let currentInventory = [];
let supabaseClient = null;

function logToScreen(msg, type = 'info') {
    console.log(`[v2.2] ${msg}`);
    const grid = document.getElementById('inventoryGrid');
    if (grid) {
        let debugBox = document.getElementById('debug-console');
        if (!debugBox) {
            debugBox = document.createElement('div');
            debugBox.id = 'debug-console';
            debugBox.style = "grid-column: 1/-1; background: #000; color: #0f0; padding: 20px; font-family: monospace; font-size: 0.8rem; border-radius: 12px; border: 1px solid #333; margin-bottom: 20px; white-space: pre-wrap;";
            debugBox.innerHTML = "<b>CONSOLA v2.2 - DIAGNÓSTICO DE RED</b><br>";
            grid.parentElement.insertBefore(debugBox, grid);
        }
        const color = type === 'error' ? '#ff3333' : (type === 'success' ? '#00ff00' : '#888');
        debugBox.innerHTML += `<span style="color: ${color}">[${new Date().toLocaleTimeString()}] ${msg}</span><br>`;
    }
}

async function supabaseFetch(table, select = '*', timeoutMs = 20000) { // Increased to 20s
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}`;
    logToScreen(`Pidiendo ${table}...`);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            signal: controller.signal
        });
        clearTimeout(timer);

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`HTTP ${response.status}: ${err}`);
        }

        const data = await response.json();
        logToScreen(`✅ ${table} OK (${data.length} filas).`, 'success');
        return data;
    } catch (e) {
        clearTimeout(timer);
        if (e.name === 'AbortError') {
            logToScreen(`⚠️ PRUEBA MANUAL: <a href="${url}" target="_blank" style="color:#0f0">Haz clic aquí para ver si carga en una pestaña nueva</a>`, 'error');
            throw new Error(`Timeout en ${table} (20 segundos agotados).`);
        }
        throw e;
    }
}

async function init() {
    logToScreen("Iniciando carga de datos...");
    const statusEl = document.getElementById('connectionStatus');

    try {
        if (statusEl) statusEl.textContent = "⏳ Conectando...";

        // Cargar lo básico con tiempo extendido
        locations = await supabaseFetch('locations', '*', 20000);
        allProducts = await supabaseFetch('products', 'id,name,category,image,images', 20000);

        await fetchInventory();

        if (statusEl) {
            statusEl.textContent = "● Sincronizado";
            statusEl.style.color = "#2ecc71";
        }

        if (currentInventory.length > 0) {
            setTimeout(() => {
                const b = document.getElementById('debug-console');
                if (b) b.style.display = 'none';
            }, 5000);
        }

    } catch (e) {
        logToScreen(`FALLO: ${e.message}`, 'error');
        if (statusEl) {
            statusEl.textContent = "⚠️ Error";
            statusEl.style.color = "#ff3333";
        }
    }
}

async function fetchInventory() {
    try {
        logToScreen("Cargando inventario...");
        const data = await supabaseFetch('view_inventory_details', '*', 15000);

        currentInventory = data.map(item => {
            const prod = allProducts.find(p => p.id === item.product_id);
            let img = item.image;
            if (prod) {
                if (!img) img = prod.image;
                if (!img && prod.images && Array.isArray(prod.images) && prod.images.length > 0) img = prod.images[0];
            }
            return { ...item, image: img };
        });
        updateUI();
    } catch (err) {
        logToScreen(`Fallback a tabla cruda...`, 'error');
        try {
            const rawData = await supabaseFetch('inventory', '*', 15000);
            currentInventory = rawData.map(item => {
                const prod = allProducts.find(p => p.id === item.product_id);
                const loc = locations.find(l => l.id === item.location_id);
                return {
                    ...item,
                    product_name: prod ? prod.name : 'Modelo ?',
                    category: prod ? prod.category : 'N/A',
                    location_name: loc ? loc.name : 'Bodega',
                    image: prod ? (prod.image || (prod.images && prod.images[0])) : null
                };
            });
            updateUI();
        } catch (e2) {
            logToScreen(`Error final: ${e2.message}`, 'error');
            currentInventory = [];
            updateUI();
        }
    }
}

function updateUI() {
    if (typeof renderDashboard === 'function') renderDashboard();
    if (typeof renderSalesUI === 'function') renderSalesUI();
}

function formatCurrency(val) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
}
