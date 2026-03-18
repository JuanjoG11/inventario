const https = require('https');

const SUPABASE_URL = 'shbtmkeyarqppasdpzxv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYnRta2V5YXJxcHBhc2Rwenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjEzODQsImV4cCI6MjA4NzQzNzM4NH0.Z4Bqo7NHUNs736UBbSG79OEwXEPQvG9ZUrgemLEquGQ';

function supabaseRequest(path, method = 'POST', body = null) {
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
                'Prefer': 'return=representation'
            }
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (d) => { data += d; });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try { resolve(JSON.parse(data)); } catch (e) { resolve(data); }
                } else {
                    reject(new Error(`Status ${res.statusCode}: ${data}`));
                }
            });
        });
        req.on('error', (e) => reject(e));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

const COLLECTONS = [
    { name: "Colección La Pesada", category: "Petos y Camisetas", image: "https://i.ibb.co/vzP6qFm/la-pesada.webp", sizes: JSON.stringify(["S", "M", "L", "XL"]) },
    { name: "Colección La Grasa", category: "Petos y Camisetas", image: "https://i.ibb.co/vzP6qFm/la-grasa.webp", sizes: JSON.stringify(["S", "M", "L", "XL"]) },
    { name: "Colección Los Calidosos", category: "Petos y Camisetas", image: "https://i.ibb.co/vzP6qFm/calidosos.webp", sizes: JSON.stringify(["S", "M", "L", "XL"]) }
];

async function run() {
    try {
        console.log("🚀 Importando Colecciones a Supabase...");
        for (const prod of COLLECTONS) {
            console.log(`🔹 Insertando: ${prod.name}`);
            const result = await supabaseRequest('products', 'POST', prod);
            const productId = result[0].id;
            console.log(`   ✅ ID: ${productId}`);

            // Insert initial inventory
            const sizes = ["S", "M", "L", "XL"];
            for (const size of sizes) {
                await supabaseRequest('inventory', 'POST', {
                    product_id: productId,
                    location_id: 0,
                    size: size,
                    stock: 3
                });
                console.log(`      - Talla ${size}: Stock 3`);
            }
        }
        console.log("✅ Importación completada con éxito.");
    } catch (err) {
        console.error("❌ Error en la importación:", err.message);
    }
}

run();
