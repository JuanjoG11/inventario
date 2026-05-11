async function restoreWebAdmin() {
    const SUPABASE_URL = 'https://shbtmkeyarqppasdpzxv.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYnRta2V5YXJxcHBhc2Rwenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjEzODQsImV4cCI6MjA4NzQzNzM4NH0.Z4Bqo7NHUNs736UBbSG79OEwXEPQvG9ZUrgemLEquGQ';

    console.log("🛠️  Sincronizando el Admin de la Web (inyectando Stock 1 en metadata)...");

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id,name,sizes`, {
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        });
        const products = await response.json();

        for (const product of products) {
            let sizes = [];
            try {
                const parsed = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes;
                if (Array.isArray(parsed)) sizes = parsed;
                else if (typeof parsed === 'object' && parsed !== null) sizes = Object.keys(parsed);
            } catch (e) {
                if (product.sizes && typeof product.sizes === 'string') {
                    sizes = product.sizes.split(',').map(s => s.trim());
                }
            }

            if (Array.isArray(sizes) && sizes.length > 0) {
                process.stdout.write(`\r🚀 Actualizando metadata: ${product.name.substring(0, 20)}...`);

                // Crear el nuevo formato con Stock = 1
                const newSizesMetadata = sizes.map(s => {
                    const sizeKey = (typeof s === 'object' && s !== null) ? (s.size || s.talla || Object.keys(s)[0]) : s;
                    return { size: sizeKey.toString(), stock: 1 };
                });

                // ACTUALIZAR LA TABLA DE PRODUCTOS
                await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${product.id}`, {
                    method: 'PATCH',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sizes: JSON.stringify(newSizesMetadata)
                    })
                });
            }
        }

        console.log("\n\n✅ ¡LISTO! Refresca el panel de la web ahora.");
        console.log("Los ceros deberían haber desaparecido.");

    } catch (err) {
        console.error("\n❌ Error:", err.message);
    }
}

restoreWebAdmin();
