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
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        };
        const req = https.request(options, (res) => {
            res.on('end', () => resolve(res.statusCode));
        });
        req.end();
    });
}

async function clean() {
    console.log("🗑️ Eliminando producto accidental 'BODEGA LOCAL'...");
    await request('inventory?product_id=eq.4', 'DELETE');
    await request('products?id=eq.4', 'DELETE');
    console.log("✅ Limpio.");
}
clean();
