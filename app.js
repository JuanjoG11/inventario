// 🚀 TENNIS Y MAS - APP v2.0 (DIAGNÓSTICO)
const SUPABASE_URL = 'https://nrlaadaggmpjtdmtntoz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybGFhZGFnZ21wanRkbXRudG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTM0NjksImV4cCI6MjA4NTAyOTQ2OX0.B7RLhRRvuz5jAsRAHLhWIPtW3KdhEEAKzoKV3DfeoJE';

// State
let locations = [];
let allProducts = [];
let currentInventory = [];
let supabaseClient = null;

/**
 * 🛰️ DIAGNOSTIC LOGGER - Aparece de inmediato
 */
function logToScreen(msg, type = 'info') {
    console.log(`[Diagnostic v2.0] ${msg}`);
    const grid = document.getElementById('inventoryGrid');
    if (grid) {
        let debugBox = document.getElementById('debug-console');
        if (!debugBox) {
            debugBox = document.createElement('div');
            debugBox.id = 'debug-console';
            debugBox.style = "grid-column: 1/-1; background: #000; color: #0f0; padding: 20px; font-family: monospace; font-size: 0.8rem; border-radius: 12px; border: 1px solid #333; margin-bottom: 20px; white-space: pre-wrap;";
            debugBox.innerHTML = "<b>CONSOLA DE DIAGNÓSTICO v2.0</b> (Si ves esto, el código se actualizó)<br>";
            grid.parentElement.insertBefore(debugBox, grid);
        }
        const color = type === 'error' ? '#ff3333' : (type === 'success' ? '#00ff00' : '#888');
        debugBox.innerHTML += `<span style="color: ${color}">[${new Date().toLocaleTimeString()}] ${msg}</span><br>`;
    }
}

/**
 * 🛰️ DIRECT FETCH WITH TIMEOUT
 */
async function supabaseFetch(table, select = '*') {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}`;
    logToScreen(`Conectando a: ${table}...`);

    try {
        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`HTTP ${response.status}: ${err}`);
        }

        const data = await response.json();
        logToScreen(`✅ Cargado ${table}: ${data.length} filas.`, 'success');
        return data;
    } catch (e) {
        logToScreen(`❌ Error en ${table}: ${e.message}`, 'error');
        throw e;
    }
}

// Initialize App
async function init() {
    logToScreen("🚀 Iniciando conexión...");
    const statusEl = document.getElementById('connectionStatus');
    const grid = document.getElementById('inventoryGrid');

    if (window.location.protocol === 'file:') {
        logToScreen("ERROR: Estás abriendo el archivo local. Usa el link de Vercel.", "error");
        return;
    }

    try {
        if (statusEl) statusEl.textContent = "⏳ Sincronizando...";

        // Cargar datos
        locations = await supabaseFetch('locations');
        allProducts = await supabaseFetch('products', 'id,name,category,image,images');
        await fetchInventory();

        if (statusEl) {
            statusEl.textContent = "● Sincronizado";
            statusEl.style.color = "#2ecc71";
        }

    } catch (e) {
        console.error("❌ Init Error:", e);
        if (statusEl) {
            statusEl.textContent = "⚠️ Error";
            statusEl.style.color = "#ff3333";
        }
    }
}

async function fetchInventory() {
    try {
        const data = await supabaseFetch('view_inventory_details');
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
        logToScreen("Fallo vista, usando tabla cruda...", "error");
        const rawData = await supabaseFetch('inventory');
        currentInventory = rawData.map(item => {
            const prod = allProducts.find(p => p.id === item.product_id);
            return {
                ...item,
                product_name: prod ? prod.name : 'Unknown',
                category: prod ? prod.category : 'N/A',
                location_name: item.location_id === 1 ? 'Sede Fantasias New York' : 'Sede Bulevar',
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
