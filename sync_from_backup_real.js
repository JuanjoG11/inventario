const fs = require('fs');
const https = require('https');

const BACKUP_PATH = 'C:\\Users\\Juanjo\\Downloads\\backup_tennisymas_2026-05-11.json';
const SUPABASE_URL = 'shbtmkeyarqppasdpzxv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYnRta2V5YXJxcHBhc2Rwenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjEzODQsImV4cCI6MjA4NzQzNzM4NH0.Z4Bqo7NHUNs736UBbSG79OEwXEPQvG9ZUrgemLEquGQ';

function supabaseRequest(table, body = null, method = 'POST') {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: SUPABASE_URL,
            port: 443,
            path: `/rest/v1/${table}`,
            method: method,
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            }
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (d) => { data += d; });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) resolve(data);
                else reject(new Error(`Status ${res.statusCode}: ${data}`));
            });
        });
        req.on('error', (e) => reject(e));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function sync() {
    console.log("🚀 Iniciando SINCRONIZACIÓN DESDE BACKUP REAL...");

    if (!fs.existsSync(BACKUP_PATH)) {
        console.error("❌ No se encontró el archivo de backup en Downloads.");
        return;
    }

    const backup = JSON.parse(fs.readFileSync(BACKUP_PATH, 'utf8'));
    const products = backup.data.products || [];
    const inventory = backup.data.inventory || [];

    console.log(`📦 Encontrados ${products.length} productos y ${inventory.length} registros de inventario.`);

    try {
        // 1. Sync Products
        console.log("📤 Sincronizando tabla 'products'...");
        const productsToSync = products.map(p => {
            // Convert sizes array to the "Admin-compatible" object format {"size": 1}
            const sizesObj = {};
            if (Array.isArray(p.sizes)) {
                p.sizes.forEach(s => { if(s) sizesObj[s.toString()] = 1; });
            }
            
            return {
                id: p.id,
                name: p.name,
                category: p.category,
                image: p.image,
                images: p.images,
                sizes: JSON.stringify(sizesObj), // Enforce object format for Web Admin
                price: p.price,
                created_at: p.created_at
            };
        });

        for (let i = 0; i < productsToSync.length; i += 20) {
            const chunk = productsToSync.slice(i, i + 20);
            await supabaseRequest('products', chunk);
            process.stdout.write(`\r   - Productos: ${i + chunk.length}/${productsToSync.length}`);
        }
        console.log("\n✅ Productos sincronizados.");

        // 2. Sync Inventory
        console.log("📤 Sincronizando tabla 'inventory'...");
        // We only take valid inventory records
        const inventoryToSync = inventory.map(i => ({
            id: i.id,
            product_id: i.product_id,
            location_id: i.location_id,
            size: i.size.toString(),
            stock: i.stock,
            updated_at: i.updated_at
        }));

        for (let i = 0; i < inventoryToSync.length; i += 50) {
            const chunk = inventoryToSync.slice(i, i + 50);
            await supabaseRequest('inventory', chunk);
            process.stdout.write(`\r   - Inventario: ${i + chunk.length}/${inventoryToSync.length}`);
        }
        console.log("\n✅ Inventario sincronizado.");

        console.log("\n✨ ¡SINCRONIZACIÓN COMPLETADA CON ÉXITO! ✨");
        console.log("El panel de admin y la web ahora deberían estar reflejando estos datos.");

    } catch (err) {
        console.error("\n❌ Error crítico durante la sincronización:", err.message);
    }
}

sync();
