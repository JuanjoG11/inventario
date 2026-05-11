async function fixWebAdminTallas() {
    const SUPABASE_URL = 'https://shbtmkeyarqppasdpzxv.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYnRta2V5YXJxcHBhc2Rwenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjEzODQsImV4cCI6MjA4NzQzNzM4NH0.Z4Bqo7NHUNs736UBbSG79OEwXEPQvG9ZUrgemLEquGQ';

    console.log("🛠️  Corrigiendo formato de tallas para el Admin de la Web...");

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id,name,sizes`, {
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        });
        const products = await response.json();

        for (const product of products) {
            let sizesKeys = [];
            try {
                // Intentar extraer las llaves de las tallas sin importar el formato actual
                const parsed = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes;
                if (Array.isArray(parsed)) {
                    sizesKeys = parsed.map(item => (typeof item === 'object' && item !== null) ? (item.size || item.talla || Object.keys(item)[0]) : item);
                } else if (typeof parsed === 'object' && parsed !== null) {
                    sizesKeys = Object.keys(parsed);
                }
            } catch (e) {
                if (product.sizes && typeof product.sizes === 'string') {
                    sizesKeys = product.sizes.split(',').map(s => s.trim());
                }
            }

            if (sizesKeys.length > 0) {
                process.stdout.write(`\r🔄 Restaurando tallas en: ${product.name.substring(0, 20)}...`);

                // Formato de OBJETO SIMPLE (el más compatible: {"40": 1, "41": 1})
                const fixedObject = {};
                sizesKeys.forEach(k => { if(k) fixedObject[k.toString()] = 1; });

                await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${product.id}`, {
                    method: 'PATCH',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sizes: JSON.stringify(fixedObject)
                    })
                });
            }
        }

        console.log("\n\n✅ ¡CORREGIDO! Refresca la web ahora.");
        console.log("Las tallas deberían volver a aparecer con el número 1.");

    } catch (err) {
        console.error("\n❌ Error:", err.message);
    }
}

fixWebAdminTallas();
