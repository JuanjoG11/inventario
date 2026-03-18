const https = require('https');

const SUPABASE_URL = 'shbtmkeyarqppasdpzxv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYnRta2V5YXJxcHBhc2Rwenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjEzODQsImV4cCI6MjA4NzQzNzM4NH0.Z4Bqo7NHUNs736UBbSG79OEwXEPQvG9ZUrgemLEquGQ';

const RAW_MESSAGE = `[1:51 PM, 3/9/2026] +57 313 5169857: BODEGA LOCAL
Teni guayo F50 tubular naranja 
39 1
40 1
41 1
42 1
43 1
44 1
45 1
Total 7 pares
[1:54 PM, 3/9/2026] +57 313 5169857: Guayo predator 26 negro blanco sin lengüeta 
40 1
41 1
Total 2 para
[1:56 PM, 3/9/2026] +57 313 5169857: Guayo phantom GX blanco azul claro 
40 1
41 1
Total 2 pares
[1:57 PM, 3/9/2026] +57 313 5169857: Guayo phantom GX azul negro 
39 1
41 1 
Total 2 pares
[1:58 PM, 3/9/2026] +57 313 5169857: Teni Guayo GX 6 plata fucsia
361
37 1
38 1
Total 3 pares
[2:01 PM, 3/9/2026] +57 313 5169857: Tení Guayo F50 verde blanco 
39 1
40 3
42 1
43 1
Total 6 pares
[2:02 PM, 3/9/2026] +57 313 5169857: Teni guayo F50 blanco verde tubular 
43 2 
44 1
45 1
Total 4 pares
[2:07 PM, 3/9/2026] +57 313 5169857: Teni Guayo GX bata azul blanco 
40 1
41 1
42 1
43 1
44 1
45 1
Total 6 pares
[2:11 PM, 3/9/2026] +57 313 5169857: Guayo phantom Nike gripknit azul claro 
40 2 
Total 2 pares`;

function supabaseRequest(path, method = 'GET', body = null, extraHeaders = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: SUPABASE_URL,
            port: 443,
            path: `/rest/v1/${path}`,
            method: method,
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                ...extraHeaders
            }
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (d) => { data += d; });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try { resolve(data ? JSON.parse(data) : null); } catch (e) { resolve(data); }
                } else {
                    console.error(`❌ Error Supabase (${method} ${path}): ${res.statusCode}`);
                    console.error(data);
                    reject(new Error(`Status ${res.statusCode}`));
                }
            });
        });
        req.on('error', (e) => reject(e));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function processInventory() {
    console.log("🚀 Iniciando procesamiento...");

    // 1. Separate by timestamp
    const parts = RAW_MESSAGE.split(/\[\d+:\d+ [AP]M, \d+\/\d+\/\d+\] \+\d+ \d+ \d+: /);
    const validSections = parts.map(s => s.trim()).filter(s => s);

    console.log(`📝 Se encontraron ${validSections.length} secciones de productos.`);

    const productsToUpdate = [];

    for (const section of validSections) {
        const lines = section.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length < 1) continue;

        let productName = lines[0];

        // Skip header-only sections
        if (productName === "BODEGA LOCAL") {
            if (lines.length > 1) {
                productName = lines[1];
                lines.shift();
            } else {
                continue;
            }
        }

        const stockItems = [];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (line.toLowerCase().includes("total")) continue;

            // Match "39 1" or "361"
            let match = line.match(/^(\d{2})\s+(\d+)$/) || line.match(/^(\d{2})(\d+)$/);
            if (match) {
                stockItems.push({
                    size: match[1],
                    qty: parseInt(match[2])
                });
            }
        }

        if (stockItems.length > 0) {
            productsToUpdate.push({ name: productName, stockItems });
        }
    }

    console.log(`📦 Preparados ${productsToUpdate.length} productos para subir.`);

    // 2. Fetch current products
    const dbProducts = await supabaseRequest('products?select=id,name');
    console.log(`📡 DB tiene ${dbProducts.length} productos.`);

    for (const item of productsToUpdate) {
        console.log(`\n🔹 Procesando: "${item.name}"`);

        let match = dbProducts.find(p => p.name.toLowerCase().trim() === item.name.toLowerCase().trim());
        if (!match) {
            match = dbProducts.find(p => p.name.toLowerCase().includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(p.name.toLowerCase()));
        }

        let productId;
        if (match) {
            console.log(`   ✅ Match: "${match.name}" (ID: ${match.id})`);
            productId = match.id;
        } else {
            console.log(`   🆕 Producto nuevo. Creando...`);
            const res = await supabaseRequest('products', 'POST', {
                name: item.name,
                category: "Guayos",
                image: "images/logo-tm.png",
                sizes: JSON.stringify(item.stockItems.map(s => s.size))
            }, { 'Prefer': 'return=representation' });

            // If return=representation works, res is array of created items
            if (Array.isArray(res) && res.length > 0) {
                productId = res[0].id;
            } else {
                // Fallback: fetch latest
                const latest = await supabaseRequest('products?select=id&order=id.desc&limit=1');
                productId = latest[0].id;
            }
            console.log(`   🆔 ID asignado: ${productId}`);
        }

        // 3. Update stock in inventory
        console.log(`   🧤 Actualizando stock...`);
        for (const stock of item.stockItems) {
            await supabaseRequest('inventory?on_conflict=product_id,location_id,size', 'POST', {
                product_id: productId,
                location_id: 0,
                size: stock.size,
                stock: stock.qty
            }, { 'Prefer': 'resolution=merge-duplicates' });
            console.log(`      - Talla ${stock.size}: ${stock.qty}`);
        }
    }

    console.log("\n✅ ¡LISTO! Todo actualizado.");
}

processInventory().catch(err => {
    console.error("❌ ERROR FATAL:");
    console.error(err);
});
