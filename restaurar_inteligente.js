async function restoreSmart() {
    const SUPABASE_URL = 'https://shbtmkeyarqppasdpzxv.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYnRta2V5YXJxcHBhc2Rwenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjEzODQsImV4cCI6MjA4NzQzNzM4NH0.Z4Bqo7NHUNs736UBbSG79OEwXEPQvG9ZUrgemLEquGQ';

    console.log("🧠 Iniciando restauración inteligente (Stock = 1 por talla)...");

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id,name,sizes`, {
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        });
        const products = await response.json();

        console.log(`📦 Procesando ${products.length} productos...`);

        for (const product of products) {
            let sizes = [];
            try {
                sizes = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes;
            } catch (e) {
                if (product.sizes) {
                   if (product.sizes.includes(',')) sizes = product.sizes.split(',').map(s => s.trim());
                   else sizes = [product.sizes];
                }
            }

            if (Array.isArray(sizes) && sizes.length > 0) {
                process.stdout.write(`\r🛠️  Restaurando: ${product.name.substring(0, 20)}...`);
                
                const rows = sizes.map(s => {
                    const sizeKey = (typeof s === 'object' && s !== null) ? (s.size || s.talla) : s;
                    if (!sizeKey) return null;
                    return {
                        product_id: product.id,
                        location_id: 0,
                        size: sizeKey.toString(),
                        stock: 1,
                        updated_at: new Date()
                    };
                }).filter(r => r !== null);

                if (rows.length > 0) {
                    await fetch(`${SUPABASE_URL}/rest/v1/inventory`, {
                        method: 'POST',
                        headers: {
                            'apikey': SUPABASE_KEY,
                            'Authorization': `Bearer ${SUPABASE_KEY}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'resolution=merge-duplicates'
                        },
                        body: JSON.stringify(rows)
                    });
                }
            }
        }

        console.log("\n\n✅ ¡ÉXITO! La tienda ha vuelto a la vida.");
        console.log("🚀 Todos los productos tienen ahora 1 unidad por cada talla que estaba configurada.");
    } catch (err) {
        console.error("\n❌ Error:", err.message);
    }
}

restoreSmart();
