// 🚀 TENNIS Y MAS - APP v5.0 (MODO DEMO HÍBRIDO)
const SUPABASE_URL = 'https://nrlaadaggmpjtdmtntoz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybGFhZGFnZ21wanRkbXRudG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTM0NjksImV4cCI6MjA4NTAyOTQ2OX0.B7RLhRRvuz5jAsRAHLhWIPtW3KdhEEAKzoKV3DfeoJE';

// State
let locations = [{ id: 1, name: "Sede Fantasias New York" }, { id: 2, name: "Sede Bulevar" }];
let allProducts = [];
let currentInventory = [];

/**
 * 🛰️ MODO DEMO - Carga instantánea si el servidor falla
 */
const DEMO_INIT_DATA = [
    { product_name: "Nike Air Force 1 White", category: "Urbano", size: "38", stock: 12, location_name: "Sede Bulevar", image: "https://images.nike.com/is/image/DotCom/CW2288_111_A_PREM?wid=600&fmt=png-alpha" },
    { product_name: "Nike Air Force 1 White", category: "Urbano", size: "40", stock: 8, location_name: "Sede Bulevar", image: "https://images.nike.com/is/image/DotCom/CW2288_111_A_PREM?wid=600&fmt=png-alpha" },
    { product_name: "Nike Mercurial Vapor", category: "Fútbol Sala", size: "41", stock: 5, location_name: "Sede Fantasias New York", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:sep/597c5cb9-8e4a-464a-8994-0a37e8c372f8/mercurial-vapor-15-academy-ic-low-top-football-boot-7S7ZJp.png" },
    { product_name: "Adidas Forum Low", category: "Urbano", size: "39", stock: 15, location_name: "Sede Bulevar", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/837775553a1d48c99180ad7d013f990a_9366/Tenis_Forum_Low_Negro_GV9766_01_standard.jpg" },
    { product_name: "Jordan 1 Retro", category: "Urbano", size: "42", stock: 2, location_name: "Sede Fantasias New York", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:sep/416ff5bc-425b-4394-a169-6d601d5e6837/air-jordan-1-retro-high-og-shoes-8798.png" }
];

async function init() {
    console.log("🚀 Iniciando Modo Híbrido...");
    const statusEl = document.getElementById('connectionStatus');

    // 1. Mostrar datos de demo INMEDIATAMENTE para la cámara
    currentInventory = DEMO_INIT_DATA;
    updateUI();

    if (statusEl) {
        statusEl.textContent = "● Modo Demo (Sync...)";
        statusEl.style.color = "#f1c40f";
    }

    // 2. Intentar cargar datos reales en segundo plano
    try {
        const realData = await xhrFetch('view_inventory_details');
        if (realData && realData.length > 0) {
            currentInventory = realData;
            updateUI();
            if (statusEl) {
                statusEl.textContent = "● Sincronizado";
                statusEl.style.color = "#2ecc71";
            }
        }
    } catch (e) {
        console.warn("No se pudo sincronizar, manteniendo demo.");
    }
}

function xhrFetch(table, select = '*') {
    return new Promise((resolve, reject) => {
        const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}`;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('apikey', SUPABASE_KEY);
        xhr.setRequestHeader('Authorization', `Bearer ${SUPABASE_KEY}`);
        xhr.timeout = 5000; // Timeout corto para soltar el demo rápido
        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300) ? resolve(JSON.parse(xhr.responseText)) : reject();
        xhr.onerror = () => reject();
        xhr.send();
    });
}

function updateUI() {
    if (typeof renderDashboard === 'function') renderDashboard();
    if (typeof renderSalesUI === 'function') renderSalesUI();
}
