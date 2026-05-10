const https = require('https');

const SUPABASE_URL = 'shbtmkeyarqppasdpzxv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYnRta2V5YXJxcHBhc2Rwenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjEzODQsImV4cCI6MjA4NzQzNzM4NH0.Z4Bqo7NHUNs736UBbSG79OEwXEPQvG9ZUrgemLEquGQ';

function supabaseRequest(path, method = 'GET', body = null) {
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
                    try { resolve(data ? JSON.parse(data) : null); } catch (e) { resolve(data); }
                } else {
                    console.error(`Error ${method} ${path}: ${res.statusCode}`);
                    console.error(data);
                    resolve(null);
                }
            });
        });
        req.on('error', (e) => reject(e));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function mergeProducts() {
    console.log("🔍 Buscando duplicados...");
    const products = await supabaseRequest('products?select=id,name');
    if (!products) return;

    const nameGroups = {};
    products.forEach(p => {
        const cleanName = p.name.trim();
        if (!nameGroups[cleanName]) nameGroups[cleanName] = [];
        nameGroups[cleanName].push(p.id);
    });

    const duplicates = Object.entries(nameGroups).filter(([name, ids]) => ids.length > 1);

    if (duplicates.length === 0) {
        console.log("✅ No hay duplicados que fusionar.");
        return;
    }

    for (const [name, ids] of duplicates) {
        const masterId = Math.min(...ids);
        const dupIds = ids.filter(id => id !== masterId);

        console.log(`\n🔹 Fusionando "${name}":`);
        console.log(`   - Master ID: ${masterId}`);
        console.log(`   - Duplicados a eliminar: ${dupIds.join(', ')}`);

        for (const dupId of dupIds) {
            // 1. Mover inventario
            const invRecords = await supabaseRequest(`inventory?product_id=eq.${dupId}`);
            if (invRecords && invRecords.length > 0) {
                console.log(`   - Moviendo ${invRecords.length} registros de inventario de ID ${dupId} a ${masterId}...`);
                for (const rec of invRecords) {
                    // Check if master already has record for this sede/size
                    const masterRec = await supabaseRequest(`inventory?product_id=eq.${masterId}&location_id=eq.${rec.location_id}&size=eq.${rec.size}`);
                    
                    if (masterRec && masterRec.length > 0) {
                        // Update master record by adding stock
                        const newStock = masterRec[0].stock + rec.stock;
                        await supabaseRequest(`inventory?id=eq.${masterRec[0].id}`, 'PATCH', { stock: newStock });
                        // Delete duplicate record
                        await supabaseRequest(`inventory?id=eq.${rec.id}`, 'DELETE');
                    } else {
                        // Simply update product_id
                        await supabaseRequest(`inventory?id=eq.${rec.id}`, 'PATCH', { product_id: masterId });
                    }
                }
            }

            // 2. Mover ventas
            const salesRecords = await supabaseRequest(`sales?product_id=eq.${dupId}`);
            if (salesRecords && salesRecords.length > 0) {
                console.log(`   - Actualizando ${salesRecords.length} ventas de ID ${dupId} a ${masterId}...`);
                await supabaseRequest(`sales?product_id=eq.${dupId}`, 'PATCH', { product_id: masterId });
            }

            // 3. Eliminar producto duplicado
            console.log(`   - Eliminando producto ID ${dupId}...`);
            await supabaseRequest(`products?id=eq.${dupId}`, 'DELETE');
        }
    }

    console.log("\n✅ ¡Fusión completada!");
}

mergeProducts();
