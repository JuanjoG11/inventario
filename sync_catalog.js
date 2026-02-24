const fs = require('fs');
const path = require('path');
const https = require('https');

const CSV_PATH = path.join('C:', 'Users', 'Juanjo', 'Downloads', 'products_rows.csv');
const SUPABASE_URL = 'shbtmkeyarqppasdpzxv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYnRta2V5YXJxcHBhc2Rwenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjEzODQsImV4cCI6MjA4NzQzNzM4NH0.Z4Bqo7NHUNs736UBbSG79OEwXEPQvG9ZUrgemLEquGQ';

function csvToJson(csvContent) {
    const lines = csvContent.split('\n');
    const products = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = [];
        let current = '';
        let inQuotes = false;
        for (let char of line) {
            if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) {
                parts.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        parts.push(current);
        if (parts.length < 10) continue;
        try {
            const id = parseInt(parts[0]);
            const name = parts[2] ? parts[2].replace(/^"|"$/g, '').replace(/""/g, '"') : '';
            const category = parts[3] ? parts[3].replace(/^"|"$/g, '').replace(/""/g, '"') : '';
            const image = parts[6] ? parts[6].replace(/^"|"$/g, '').replace(/""/g, '"') : '';
            let sizes = parts[7];
            if (sizes && sizes.startsWith('"') && sizes.endsWith('"')) {
                sizes = sizes.substring(1, sizes.length - 1).replace(/""/g, '"');
            }
            products.push({ id, name, category, image, sizes: sizes || "[]" });
        } catch (e) { }
    }
    return products;
}

function supabaseRequest(path, method, body = null, extraHeaders = {}) {
    return new Promise((resolve, reject) => {
        const headers = {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
            ...extraHeaders
        };
        const options = {
            hostname: SUPABASE_URL,
            port: 443,
            path: `/rest/v1/${path}`,
            method: method,
            headers
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
    console.log("🚀 Iniciando LIMPIEZA TOTAL y sincronización con STOCK 3...");
    const content = fs.readFileSync(CSV_PATH, 'utf8');
    const products = csvToJson(content);
    console.log(`📦 Productos en CSV: ${products.length}`);

    try {
        // 1. Aggressive clearing
        console.log("🧹 Borrando inventario existente...");
        // Repeated deletes just in case of timeout or large volume
        for (let j = 0; j < 5; j++) {
            try { await supabaseRequest('inventory?product_id=gt.0', 'DELETE'); } catch (e) { }
        }

        console.log("🧹 Borrando productos existentes...");
        for (let j = 0; j < 5; j++) {
            try { await supabaseRequest('products?id=gt.0', 'DELETE'); } catch (e) { }
        }

        await new Promise(r => setTimeout(r, 2000));

        // 2. Upload Products using UPSERT headers for safety
        console.log("📤 Subiendo productos...");
        for (let i = 0; i < products.length; i += 5) {
            const chunk = products.slice(i, i + 5);
            await supabaseRequest('products', 'POST', chunk, { 'Prefer': 'resolution=merge-duplicates' });
            console.log(`   - Productos: ${i + chunk.length}/${products.length}`);
        }

        // 3. Prepare and Upload Inventory
        console.log("📊 Preparando inventario con STOCK 3...");
        const inventoryRows = [];
        for (const product of products) {
            let parsedSizes = [];
            try { parsedSizes = JSON.parse(product.sizes); } catch (e) { if (product.sizes) parsedSizes = [product.sizes]; }
            if (!Array.isArray(parsedSizes)) parsedSizes = [parsedSizes];
            for (const size of parsedSizes) {
                if (!size) continue;
                [1, 2, 3].forEach(locId => {
                    inventoryRows.push({
                        product_id: product.id,
                        location_id: locId,
                        size: size.toString(),
                        stock: 3
                    });
                });
            }
        }

        console.log(`📤 Subiendo ${inventoryRows.length} registros de inventario...`);
        for (let i = 0; i < inventoryRows.length; i += 50) {
            const chunk = inventoryRows.slice(i, i + 50);
            await supabaseRequest('inventory', 'POST', chunk, { 'Prefer': 'resolution=merge-duplicates' });
            console.log(`   - Progreso: ${i + chunk.length}/${inventoryRows.length}`);
        }

        console.log("✅ ¡SISTEMA LIMPIO Y STOCK ACTUALIZADO A 3!");
    } catch (err) {
        console.error("❌ Error fatal:", err.message);
    }
}
sync();
