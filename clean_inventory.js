const https = require('https');

const SUPABASE_URL = 'shbtmkeyarqppasdpzxv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYnRta2V5YXJxcHBhc2Rwenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjEzODQsImV4cCI6MjA4NzQzNzM4NH0.Z4Bqo7NHUNs736UBbSG79OEwXEPQvG9ZUrgemLEquGQ';

function request(path, method) {
    return new Promise((resolve) => {
        const options = {
            hostname: SUPABASE_URL,
            port: 443,
            path: `/rest/v1/${path}`,
            method: method,
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=minimal'
            }
        };
        const req = https.request(options, (res) => {
            res.on('end', () => resolve(res.statusCode));
        });
        req.end();
    });
}

async function clean() {
    console.log("🧹 Iniciando limpieza profunda de inventario...");
    let deleted = true;
    while (deleted) {
        // Delete in chunks of 1000 (default)
        const status = await request('inventory?id=gt.0', 'DELETE');
        console.log(`   - Status de borrado: ${status}`);

        // Wait for propagation
        await new Promise(r => setTimeout(r, 1000));

        // Check count
        const checkOptions = {
            hostname: SUPABASE_URL,
            port: 443,
            path: '/rest/v1/inventory?select=id&limit=1',
            method: 'GET',
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        };

        const count = await new Promise(resolve => {
            https.get(checkOptions, res => {
                let d = ''; res.on('data', c => d += c); res.on('end', () => {
                    try { resolve(JSON.parse(d).length); } catch (e) { resolve(0); }
                });
            });
        });

        console.log(`   - Elementos restantes: ${count}`);
        if (count === 0) deleted = false;
    }
    console.log("✅ Limpieza completada.");
}

clean();
