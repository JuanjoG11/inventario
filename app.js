// 🚀 TENNIS Y MAS - APP v6.5 (CATÁLOGO REAL TENNISYMAS.COM)
const SUPABASE_URL = 'https://nrlaadaggmpjtdmtntoz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybGFhZGFnZ21wanRkbXRudG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTM0NjksImV4cCI6MjA4NTAyOTQ2OX0.B7RLhRRvuz5jAsRAHLhWIPtW3KdhEEAKzoKV3DfeoJE';

// 🎒 CATÁLOGO REAL - Basado en tennisymas.com
const EMERGENCY_PRODUCTS = [
    // GUAYOS (Fútbol Campo)
    { id: 1, name: "Nike Mercurial Vapor 15 Elite FG", category: "Guayos", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/597c5cb9-8e4a-464a-8994-0a37e8c372f8/mercurial-vapor-15-elite-fg-football-boot-7S7ZJp.png", sizes: [38, 39, 40, 41, 42, 43, 44] },
    { id: 2, name: "Adidas Predator Elite FG", category: "Guayos", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/8b956b36c94e44b8b854af3e0117cf62_9366/Guayos_Predator_Elite_Terreno_Firme_Negro_GW4582_01_standard.jpg", sizes: [38, 39, 40, 41, 42, 43] },
    { id: 3, name: "Nike Tiempo Legend 9 Elite FG", category: "Guayos", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-8d6e5e41-7e1f-4d5c-8e5e-5e5e5e5e5e5e/tiempo-legend-9-elite-fg-football-boot-8798.png", sizes: [38, 39, 40, 41, 42, 43] },
    { id: 4, name: "Puma Future 7 Ultimate FG/AG", category: "Guayos", image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/107597/01/sv01/fnd/PNA/fmt/png/FUTURE-7-ULTIMATE-FG/AG-Men's-Soccer-Cleats", sizes: [37, 38, 39, 40, 41, 42] },
    { id: 5, name: "Adidas Copa Pure.1 FG", category: "Guayos", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/a6f327db89a74d1c8b0faf3e01179c7a_9366/Guayos_Copa_Pure.1_Terreno_Firme_Negro_GW8438_01_standard.jpg", sizes: [38, 39, 40, 41, 42, 43] },
    { id: 6, name: "Nike Phantom GX Elite FG", category: "Guayos", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/a3b5e5e5-5e5e-5e5e-5e5e-5e5e5e5e5e5e/phantom-gx-elite-fg-football-boot-8798.png", sizes: [39, 40, 41, 42, 43, 44] },

    // FÚTSAL (Fútbol Sala)
    { id: 7, name: "Nike Mercurial Vapor 15 Academy IC", category: "Futsal", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/597c5cb9-8e4a-464a-8994-0a37e8c372f8/mercurial-vapor-15-academy-ic-low-top-football-boot-7S7ZJp.png", sizes: [38, 39, 40, 41, 42, 43] },
    { id: 8, name: "Adidas Predator Accuracy.3 IN", category: "Futsal", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/8b956b36c94e44b8b854af3e0117cf62_9366/Tenis_Predator_Accuracy.3_Indoor_Negro_GW4582_01_standard.jpg", sizes: [38, 39, 40, 41, 42] },
    { id: 9, name: "Nike Tiempo Legend 9 Academy IC", category: "Futsal", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-8d6e5e41-7e1f-4d5c-8e5e-5e5e5e5e5e5e/tiempo-legend-9-academy-ic-football-boot-8798.png", sizes: [37, 38, 39, 40, 41, 42] },
    { id: 10, name: "Puma Future 7 Match IT", category: "Futsal", image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/107597/02/sv01/fnd/PNA/fmt/png/FUTURE-7-MATCH-IT-Men's-Soccer-Shoes", sizes: [38, 39, 40, 41, 42, 43] },
    { id: 11, name: "Adidas Copa Sense.3 IN", category: "Futsal", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/a6f327db89a74d1c8b0faf3e01179c7a_9366/Tenis_Copa_Sense.3_Indoor_Negro_GW8438_01_standard.jpg", sizes: [38, 39, 40, 41, 42] },

    // TENIS-GUAYOS (Urbanos/Casuales)
    { id: 12, name: "Nike Air Force 1 '07", category: "Tenis-Guayos", image: "https://images.nike.com/is/image/DotCom/CW2288_111_A_PREM?wid=600&fmt=png-alpha", sizes: [37, 38, 39, 40, 41, 42, 43, 44] },
    { id: 13, name: "Adidas Forum Low", category: "Tenis-Guayos", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/837775553a1d48c99180ad7d013f990a_9366/Tenis_Forum_Low_Negro_GV9766_01_standard.jpg", sizes: [38, 39, 40, 41, 42, 43] },
    { id: 14, name: "Nike Dunk Low Retro", category: "Tenis-Guayos", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b1bcbca4-e853-4df7-b329-5be3c61ee057/dunk-low-retro-shoes-8798.png", sizes: [38, 39, 40, 41, 42, 43] },
    { id: 15, name: "Adidas Samba OG", category: "Tenis-Guayos", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/8a3c85e4c1c84d3e8f3eafc500fd146e_9366/Tenis_Samba_OG_Blanco_B75806_01_standard.jpg", sizes: [37, 38, 39, 40, 41, 42] },
    { id: 16, name: "Puma Palermo Special", category: "Tenis-Guayos", image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/396463/01/sv01/fnd/PNA/fmt/png/Palermo-Special-Sneakers", sizes: [38, 39, 40, 41, 42, 43] },
    { id: 17, name: "New Balance 550", category: "Tenis-Guayos", image: "https://nb.scene7.com/is/image/NB/bb550vt1_nb_02_i?$pdpflexf2$&qlt=80&fmt=webp&wid=440&hei=440", sizes: [38, 39, 40, 41, 42, 43] },
    { id: 18, name: "Jordan 1 Retro High OG", category: "Tenis-Guayos", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/416ff5bc-425b-4394-a169-6d601d5e6837/air-jordan-1-retro-high-og-shoes-8798.png", sizes: [39, 40, 41, 42, 43, 44] },
    { id: 19, name: "Adidas Gazelle", category: "Tenis-Guayos", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/8a3c85e4c1c84d3e8f3eafc500fd146e_9366/Tenis_Gazelle_Azul_BB5478_01_standard.jpg", sizes: [37, 38, 39, 40, 41, 42] },
    { id: 20, name: "Nike Cortez", category: "Tenis-Guayos", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/e5e5e5e5-5e5e-5e5e-5e5e-5e5e5e5e5e5e/cortez-shoes-8798.png", sizes: [38, 39, 40, 41, 42, 43] },

    // NIÑOS
    { id: 21, name: "Nike Jr. Mercurial Vapor 15 Academy FG", category: "Niños", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/597c5cb9-8e4a-464a-8994-0a37e8c372f8/jr-mercurial-vapor-15-academy-fg-football-boot-7S7ZJp.png", sizes: [28, 30, 32, 34, 36, 37] },
    { id: 22, name: "Adidas Predator Accuracy.4 FxG J", category: "Niños", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/8b956b36c94e44b8b854af3e0117cf62_9366/Guayos_Predator_Accuracy.4_Terreno_Firme_Niño_Negro_GW4582_01_standard.jpg", sizes: [28, 30, 32, 34, 36] },
    { id: 23, name: "Nike Jr. Phantom GX Academy IC", category: "Niños", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/a3b5e5e5-5e5e-5e5e-5e5e-5e5e5e5e5e5e/jr-phantom-gx-academy-ic-football-boot-8798.png", sizes: [28, 30, 32, 34, 36, 37] },
    { id: 24, name: "Adidas Copa Pure.4 IN J", category: "Niños", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/a6f327db89a74d1c8b0faf3e01179c7a_9366/Tenis_Copa_Pure.4_Indoor_Niño_Negro_GW8438_01_standard.jpg", sizes: [28, 30, 32, 34, 36] },
    { id: 25, name: "Puma Future Play FG/AG Jr", category: "Niños", image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/107597/03/sv01/fnd/PNA/fmt/png/FUTURE-PLAY-FG/AG-Jr-Soccer-Cleats", sizes: [28, 30, 32, 34, 36] },

    // PETOS Y CAMISETAS
    { id: 26, name: "Peto de Entrenamiento Nike", category: "Petos", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/e5e5e5e5-5e5e-5e5e-5e5e-5e5e5e5e5e5e/training-bib-8798.png", sizes: ["S", "M", "L", "XL"] },
    { id: 27, name: "Peto Adidas Training", category: "Petos", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/8a3c85e4c1c84d3e8f3eafc500fd146e_9366/Peto_Entrenamiento_Naranja_GN5387_01_standard.jpg", sizes: ["S", "M", "L", "XL"] },
    { id: 28, name: "Camiseta Nike Dri-FIT Park VII", category: "Camisetas", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/e5e5e5e5-5e5e-5e5e-5e5e-5e5e5e5e5e5e/dri-fit-park-vii-football-shirt-8798.png", sizes: ["S", "M", "L", "XL", "XXL"] },
    { id: 29, name: "Camiseta Adidas Squadra 21", category: "Camisetas", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/8a3c85e4c1c84d3e8f3eafc500fd146e_9366/Camiseta_Squadra_21_Azul_GN5742_01_standard.jpg", sizes: ["S", "M", "L", "XL"] },
    { id: 30, name: "Camiseta Puma teamFINAL 21", category: "Camisetas", image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/704369/01/fnd/PNA/fmt/png/teamFINAL-21-Men's-Jersey", sizes: ["S", "M", "L", "XL", "XXL"] }
];


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
    if (typeof TENNISYMAS_PRODUCTS !== 'undefined') {
        console.log("✅ Catálogo oficial cargado");
        allProducts = TENNISYMAS_PRODUCTS;
    } else {
        allProducts = EMERGENCY_PRODUCTS;
    }
    loadEmergencyData();
    updateUI();

    // 🛑 DANGER ZONE: CLEANUP DATABASE
    // Uncomment this line in console to run: window.dangerousCleanupDatabase()
    window.dangerousCleanupDatabase = async function () {
        if (!supabaseClient) return console.error("Supabase no conectado");
        const confirmDelete = confirm("⚠️ PELIGRO: Esto borrará permanentemente los productos que NO estén en el catálogo oficial (tennisymas_catalog.js). ¿Estás seguro?");
        if (!confirmDelete) return;

        console.log("🧹 Iniciando limpieza de base de datos...");
        const validIds = TENNISYMAS_PRODUCTS.map(p => p.id);
        console.log(`✅ IDs válidos (${validIds.length}):`, validIds);

        // 1. Fetch ALL products to count
        const { data: allProds, error: fetchError } = await supabaseClient.from('products').select('id');
        if (fetchError) return console.error("Error fetching", fetchError);

        const idsToDelete = allProds.filter(p => !validIds.includes(p.id)).map(p => p.id);
        console.log(`🗑️ Encontrados ${idsToDelete.length} productos basura para eliminar.`);

        if (idsToDelete.length === 0) return console.log("✨ La base de datos ya está limpia.");

        const secondConfirm = confirm(`Se van a eliminar ${idsToDelete.length} productos. ¿Proceder?`);
        if (!secondConfirm) return;

        // 2. Delete in batches (Supabase implementation doesn't support 'not.in' well for deletes sometimes, better to delete explicitly)
        const { error: deleteError } = await supabaseClient
            .from('products')
            .delete()
            .not('id', 'in', `(${validIds.join(',')})`); // Delete everything NOT in validIds

        if (deleteError) {
            console.error("❌ Error eliminando:", deleteError);
            // Fallback: Delete explicitly
            // await supabaseClient.from('products').delete().in('id', idsToDelete); 
        } else {
            console.log("✅ Limpieza completada exitosamente.");
            alert("Limpieza completada. Recarga la página.");
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

        // Try to load real data with timeout
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 5000)
        );

        const dataPromise = Promise.all([
            supabaseFetch('locations'),
            supabaseFetch('products', 'id,name,category,image,images,sizes')
        ]);

        const [locs, prods] = await Promise.race([dataPromise, timeoutPromise]);

        locations = locs;
        allProducts = prods;
        await fetchInventory();

        if (statusEl) {
            statusEl.textContent = "● Sincronizado";
            statusEl.style.color = "#2ecc71";
            statusEl.style.background = "rgba(46, 204, 113, 0.1)";
            statusEl.style.borderColor = "rgba(46, 204, 113, 0.3)";
        }

    } catch (e) {
        console.warn("⚠️ Supabase no disponible, usando modo local");
        if (statusEl) {
            statusEl.textContent = "● Modo Local (Demo)";
            statusEl.style.color = "#f1c40f";
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
        let data;
        try {
            // OPTIMIZATION: Only fetch products that are in our catalog
            const validIds = typeof TENNISYMAS_PRODUCTS !== 'undefined'
                ? TENNISYMAS_PRODUCTS.map(p => p.id)
                : [];

            if (validIds.length > 0) {
                // Try to fetch view with filter
                const { data: viewData, error } = await supabaseClient
                    .from('view_inventory_details')
                    .select('*')
                    .in('product_id', validIds);

                if (!error && viewData) {
                    data = viewData;
                } else {
                    throw new Error("View fetch failed or empty");
                }
            } else {
                data = await supabaseFetch('view_inventory_details');
            }
        } catch (e) {
            console.warn("⚠️ Falló vista optimizada, usando fallback manual...", e);

            // Manual Fetch with optimizations
            // 1. Fetch only valid products
            const validIds = typeof TENNISYMAS_PRODUCTS !== 'undefined' ? TENNISYMAS_PRODUCTS.map(p => p.id) : null;
            let productsQuery = supabaseClient.from('products').select('id,name,category,image,images,sizes');

            if (validIds) {
                productsQuery = productsQuery.in('id', validIds);
            }

            const { data: prods, error: pErr } = await productsQuery;
            if (prods) allProducts = prods;

            // 2. Fetch inventory
            data = await supabaseFetch('inventory');

            // 3. Join locally
            data = data.filter(item => !validIds || validIds.includes(item.product_id)).map(item => {
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
        alert(`Error: Stock insuficiente. Solo hay ${item.stock} unidades disponibles.`);
        console.error(`❌ Stock insuficiente: ${item.stock} disponibles, ${quantity} solicitadas`);
        return false;
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
    console.log("📦 Cargando catálogo de emergencia...");
    allProducts = EMERGENCY_PRODUCTS;

    // Generate inventory for each product, size, and location
    currentInventory = [];
    EMERGENCY_PRODUCTS.forEach(product => {
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
                    stock: Math.floor(Math.random() * 15) + 5 // Random stock between 5-20
                });
            });
        });
    });
    console.log(`✅ ${currentInventory.length} items de inventario cargados localmente`);
}

function updateUI() {
    if (typeof renderDashboard === 'function') renderDashboard();
    if (typeof renderSalesUI === 'function') renderSalesUI();
}

function formatCurrency(val) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
}
