// 🚀 TENNIS Y MAS - APP v4.0 (ULTRA-COMPATIBLE XHR)
const SUPABASE_URL = 'https://nrlaadaggmpjtdmtntoz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybGFhZGFnZ21wanRkbXRudG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTM0NjksImV4cCI6MjA4NTAyOTQ2OX0.B7RLhRRvuz5jAsRAHLhWIPtW3KdhEEAKzoKV3DfeoJE';

// State
let locations = [];
let allProducts = [];
let currentInventory = [];

function logToScreen(msg, type = 'info') {
    console.log(`[v4.0] ${msg}`);
    const grid = document.getElementById('inventoryGrid');
    if (grid) {
        let debugBox = document.getElementById('debug-console');
        if (!debugBox) {
            debugBox = document.createElement('div');
            debugBox.id = 'debug-console';
            debugBox.style = "grid-column: 1/-1; background: #000; color: #0f0; padding: 20px; font-family: monospace; font-size: 0.8rem; border-radius: 12px; border: 1px solid #333; margin-bottom: 20px; white-space: pre-wrap; line-height: 1.4;";
            debugBox.innerHTML = "<b>CONSOLA v4.0 (BYPASS XHR ACTIVADO)</b><br>";
            grid.parentElement.insertBefore(debugBox, grid);
        }
        const color = type === 'error' ? '#ff3333' : (type === 'success' ? '#00ff00' : '#888');
        debugBox.innerHTML += `<span style="color: ${color}">[${new Date().toLocaleTimeString()}] ${msg}</span><br>`;
    }
}

/**
 * 🛰️ XHR FETCH (El método más tradicional y menos bloqueado)
 */
function xhrFetch(table, select = '*') {
    return new Promise((resolve, reject) => {
        const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}`;
        logToScreen(`Iniciando XHR para ${table}...`);

        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('apikey', SUPABASE_KEY);
        xhr.setRequestHeader('Authorization', `Bearer ${SUPABASE_KEY}`);

        // Timeout de 20s
        xhr.timeout = 20000;

        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    logToScreen(`✅ ${table} OK: ${data.length} filas.`, 'success');
                    resolve(data);
                } catch (e) {
                    reject(new Error("Error al procesar JSON"));
                }
            } else {
                reject(new Error(`Servidor respondió: ${xhr.status}`));
            }
        };

        xhr.onerror = function () {
            logToScreen(`🚨 Error Físico de Red en ${table}. Tu navegador o firewall bloqueó la salida.`, 'error');
            reject(new Error("CORS o Bloqueo de Red"));
        };

        xhr.ontimeout = function () {
            logToScreen(`😴 Tiempo agotado en ${table} (20s).`, 'error');
            logToScreen(`🔗 <a href="${url}" target="_blank" style="color:#0f0">[CLIC AQUÍ]</a> Prueba si este link carga datos.`, 'info');
            reject(new Error("Timeout"));
        };

        xhr.send();
    });
}

/**
 * 🛠️ INITIALIZATION
 */
async function init() {
    logToScreen("🚀 Bypass XHR iniciado. Ignorando Fetch y Librerías.");
    const statusEl = document.getElementById('connectionStatus');

    try {
        if (statusEl) statusEl.textContent = "⏳ Sincronizando...";

        // Carga secuencial para mayor estabilidad
        locations = await xhrFetch('locations');
        allProducts = await xhrFetch('products', 'id,name,category,image,images');

        await fetchInventory();

        if (statusEl) {
            statusEl.textContent = "● Sincronizado";
            statusEl.style.color = "#2ecc71";
        }

    } catch (e) {
        logToScreen(`🚨 FALLO GLOBAL: ${e.message}`, 'error');
        if (statusEl) {
            statusEl.textContent = "⚠️ Error Crítico";
            statusEl.style.color = "#ff3333";
        }
    }
}

async function fetchInventory() {
    try {
        logToScreen("Intentando cargar vista de detalles...");
        const data = await xhrFetch('view_inventory_details');
        currentInventory = data.map(item => {
            const prod = allProducts.find(p => p.id === item.product_id);
            let img = item.image || (prod ? (prod.image || (prod.images && prod.images[0])) : null);
            return { ...item, image: img };
        });
        updateUI();
    } catch (err) {
        logToScreen(`Cargando tabla de inventario cruda (Fallback)...`, 'error');
        const rawData = await xhrFetch('inventory');
        currentInventory = rawData.map(item => {
            const prod = allProducts.find(p => p.id === item.product_id);
            const loc = locations.find(l => l.id === item.location_id);
            return {
                ...item,
                product_name: prod ? prod.name : 'Unknown',
                category: prod ? prod.category : 'Deportivo',
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
