// 🚀 TENNIS Y MAS - APP v7.1 (INFINITE RESILIENCE - BYPASS CUOTA)
const SUPABASE_URL = 'https://nrlaadaggmpjtdmtntoz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybGFhZGFnZ21wanRkbXRudG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTM0NjksImV4cCI6MjA4NTAyOTQ2OX0.B7RLhRRvuz5jAsRAHLhWIPtW3KdhEEAKzoKV3DfeoJE';

/**
 * 🎒 CATALOG BACKUP (Si el servidor está bloqueado por cuota)
 */
const BACKUP_CATALOG = [
    { product_name: "Nike Air Force 1 '07", category: "Urbano", size: "38", stock: 12, location_name: "Sede Bulevar", image: "https://images.nike.com/is/image/DotCom/CW2288_111_A_PREM?wid=600&fmt=png-alpha" },
    { product_name: "Nike Air Force 1 '07", category: "Urbano", size: "40", stock: 8, location_name: "Sede Bulevar", image: "https://images.nike.com/is/image/DotCom/CW2288_111_A_PREM?wid=600&fmt=png-alpha" },
    { product_name: "Adidas Forum Low Black", category: "Urbano", size: "39", stock: 15, location_name: "Sede Bulevar", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/837775553a1d48c99180ad7d013f990a_9366/Tenis_Forum_Low_Negro_GV9766_01_standard.jpg" },
    { product_name: "Nike Mercurial Vapor 15", category: "Fútbol Sala", size: "41", stock: 5, location_name: "Sede Fantasias New York", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:sep/597c5cb9-8e4a-464a-8994-0a37e8c372f8/mercurial-vapor-15-academy-ic-low-top-football-boot-7S7ZJp.png" },
    { product_name: "Jordan 1 Retro High", category: "Urbano", size: "42", stock: 4, location_name: "Sede Fantasias New York", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:sep/416ff5bc-425b-4394-a169-6d601d5e6837/air-jordan-1-retro-high-og-shoes-8798.png" },
    { product_name: "Puma Future 7 Ultimate", category: "Guayos", size: "40", stock: 6, location_name: "Sede Bulevar", image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/107597/01/sv01/fnd/PNA/fmt/png/FUTURE-7-ULTIMATE-FG/AG-Men's-Soccer-Cleats" },
    { product_name: "Adidas Predator Elite", category: "Guayos", size: "41", stock: 3, location_name: "Sede Fantasias New York", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/63897c8d989f41058765ad7d013f990a_9366/Tenis_Predator_Elite_Negro_GV9766_01_standard.jpg" }
];

// Global State
let locations = JSON.parse(localStorage.getItem('loc_cache') || '[{"id": 1, "name": "Sede Fantasias New York"}, {"id": 2, "name": "Sede Bulevar"}]');
let allProducts = JSON.parse(localStorage.getItem('prod_cache') || '[]');
let currentInventory = JSON.parse(localStorage.getItem('inv_cache') || BACKUP_CATALOG);
let supabaseClient = null;

/**
 * 🛠️ INITIALIZATION
 */
async function init() {
    console.log("🚀 Sistema v7.1: Bypass total de cuota activado.");
    const statusEl = document.getElementById('connectionStatus');

    // 1. Mostrar backup/cache INMEDIATAMENTE
    updateUI();

    if (statusEl) {
        statusEl.innerHTML = `<span>⏳ Sincronizando...</span> <button onclick="window.location.reload()" style="background:#444; color:white; border:none; padding:4px 8px; border-radius:10px; cursor:pointer; font-size:10px;">Reintentar</button>`;
        statusEl.style.color = "#f1c40f";
    }

    // 2. Timeout Agresivo: Si en 3 segundos el servidor no responde, asumimos "Modo Offline"
    const syncTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout Sync")), 3500));

    try {
        if (window.supabase) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
        }

        // 3. Carrera entre el Servidor y el Reloj
        await Promise.race([
            (async () => {
                const [locs, prods] = await Promise.all([
                    supabaseFetch('locations'),
                    supabaseFetch('products', 'id,name,category,image,images,sizes')
                ]);
                locations = locs;
                allProducts = prods;
                localStorage.setItem('loc_cache', JSON.stringify(locations));
                localStorage.setItem('prod_cache', JSON.stringify(allProducts));
                await fetchInventory();
            })(),
            syncTimeout
        ]);

        if (statusEl) {
            statusEl.textContent = "● Sincronizado";
            statusEl.style.color = "#2ecc71";
        }

    } catch (e) {
        console.warn("⚠️ Servidor lento o bloqueado. Manteniendo datos locales.");
        if (statusEl) {
            statusEl.textContent = "● Trabajando Local (Cuota Llena)";
            statusEl.style.color = "#e67e22";
        }
    }
}

async function supabaseFetch(table, select = '*') {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}`;
    // Usar XHR para mayor compatibilidad con cuotas bajas
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('apikey', SUPABASE_KEY);
        xhr.setRequestHeader('Authorization', `Bearer ${SUPABASE_KEY}`);
        xhr.timeout = 5000;
        xhr.onload = () => (xhr.status === 200) ? resolve(JSON.parse(xhr.responseText)) : reject();
        xhr.onerror = () => reject();
        xhr.send();
    });
}

async function fetchInventory() {
    try {
        const data = await supabaseFetch('view_inventory_details');
        if (data && data.length > 0) {
            currentInventory = data;
            localStorage.setItem('inv_cache', JSON.stringify(currentInventory));
            updateUI();
        }
    } catch (err) {
        // Fallback a tabla cruda
        const rawData = await supabaseFetch('inventory').catch(e => []);
        if (rawData.length > 0) {
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
        }
    }
}

/**
 * 🛒 Optimistic Update: Restar stock inmediatamente en la pantalla
 */
async function registerSale(productId, locationId, size, quantity) {
    const index = currentInventory.findIndex(i =>
        (i.product_id === productId || i.product_name === productId) &&
        (i.location_id === locationId || i.location_name === locationId) &&
        i.size == size
    );

    if (index === -1) return alert("Error: No se encontró el item en el cache local.");

    const item = currentInventory[index];
    if (item.stock < quantity) return alert("Stock insuficiente.");

    // ACTUALIZACIÓN OPTIMISTA
    item.stock -= quantity;
    updateUI();
    localStorage.setItem('inv_cache', JSON.stringify(currentInventory));

    // Intentar sincronizar con el servidor de fondo
    if (supabaseClient) {
        supabaseClient.from('inventory')
            .update({ stock: item.stock, updated_at: new Date() })
            .match({ product_id: item.product_id, location_id: item.location_id, size: item.size })
            .then(({ error }) => {
                if (error) console.warn("Sync failed (Quota?)", error);
            });
    }

    alert("✅ Venta registrada localmente.");
    return true;
}

function updateUI() {
    if (typeof renderDashboard === 'function') renderDashboard();
    if (typeof renderSalesUI === 'function') renderSalesUI();
}
