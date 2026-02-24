/**
 * 🚀 SEED DATABASE SCRIPT
 * Run this from the browser console (Ctrl+Shift+J) while on your app page
 * once you have created the tables in Supabase.
 */
async function seedOfficialCatalog() {
    console.log("🌱 Iniciando siembra de catálogo en la nueva base de datos...");

    if (!window.supabase) {
        console.error("❌ Supabase library not found!");
        return;
    }

    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    try {
        // 1. Upload Products
        console.log(`📦 Subiendo ${TENNISYMAS_PRODUCTS.length} productos...`);
        const { error: pError } = await client
            .from('products')
            .upsert(TENNISYMAS_PRODUCTS.map(p => ({
                id: p.id,
                name: p.name,
                category: p.category,
                image: p.image,
                sizes: JSON.stringify(p.sizes)
            })));

        if (pError) throw pError;
        console.log("✅ Productos subidos con éxito.");

        // 2. Initial Inventory (0 stock for everyone)
        console.log("📊 Inicializando inventario en 0 para todas las sedes...");
        const inventoryRows = [];
        TENNISYMAS_PRODUCTS.forEach(product => {
            product.sizes.forEach(size => {
                [1, 2, 3].forEach(locId => {
                    inventoryRows.push({
                        product_id: product.id,
                        location_id: locId,
                        size: size.toString(),
                        stock: 0
                    });
                });
            });
        });

        const { error: iError } = await client
            .from('inventory')
            .upsert(inventoryRows);

        if (iError) throw iError;
        console.log(`✅ ${inventoryRows.length} registros de inventario creados con stock 0.`);

        console.log("🎉 ¡MIGRACIÓN COMPLETADA! Refresca el panel.");
        alert("Catálogo sincronizado. Ya puedes usar el sistema.");

    } catch (err) {
        console.error("❌ Error durante la siembra:", err);
        alert("Error al sincronizar: " + err.message);
    }
}

// Make it available globally if needed
window.seedOfficialCatalog = seedOfficialCatalog;
