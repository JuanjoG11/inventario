async function deepScan() {
    const SUPABASE_URL = 'https://shbtmkeyarqppasdpzxv.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYnRta2V5YXJxcHBhc2Rwenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjEzODQsImV4cCI6MjA4NzQzNzM4NH0.Z4Bqo7NHUNs736UBbSG79OEwXEPQvG9ZUrgemLEquGQ';

    console.log("🔍 Escaneo profundo de 80 productos en busca de stock...");

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id,name,sizes`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        const data = await response.json();

        let found = 0;
        data.forEach(p => {
            const raw = p.sizes;
            if (typeof raw === 'object' && !Array.isArray(raw) && raw !== null) {
                console.log(`✅ ¡STOCK ENCONTRADO! en "${p.name}"`);
                found++;
            } else if (typeof raw === 'string' && raw.includes('"stock"')) {
                console.log(`✅ ¡STOCK ENCONTRADO! (formato texto) en "${p.name}"`);
                found++;
            }
        });

        if (found > 0) {
            console.log(`\n🎉 ¡BRUTAL! Hemos encontrado ${found} productos que aún conservan sus números.`);
        } else {
            console.log("\n❌ No se encontró stock en el campo de tallas de los 80 productos.");
        }

    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}

deepScan();
