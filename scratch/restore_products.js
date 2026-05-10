const https = require('https');
const fs = require('fs');

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
                'Content-Type': 'application/json'
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

async function restoreProducts() {
    const deletedIds = [162]; // Just restore the one I missed
    const rawData = fs.readFileSync('c:\\Users\\Juanjo\\Documents\\Inventario\\db_products_current.json', 'utf8');
    const allProducts = JSON.parse(rawData);

    for (const id of deletedIds) {
        const product = allProducts.find(p => p.id === id);
        if (product) {
            console.log(`Restoring product ID ${id}: ${product.name}`);
            await supabaseRequest('products', 'POST', product);
        }
    }
    console.log("Done restoring.");
}

restoreProducts();
