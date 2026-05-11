async function check() {
    const SUPABASE_URL = 'https://shbtmkeyarqppasdpzxv.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYnRta2V5YXJxcHBhc2Rwenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjEzODQsImV4cCI6MjA4NzQzNzM4NH0.Z4Bqo7NHUNs736UBbSG79OEwXEPQvG9ZUrgemLEquGQ';

    console.log("🔍 Verificando datos reales en Supabase (via REST)...");

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=name,sizes&name=ilike.*JOMA*&limit=5`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        const data = await response.json();

        console.log("📦 Datos de PRODUCTOS encontrados:");
        console.log(JSON.stringify(data, null, 2));

        const invResponse = await fetch(`${SUPABASE_URL}/rest/v1/inventory?select=*&limit=5`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        const invData = await invResponse.json();
        console.log("\n📡 Datos de INVENTARIO encontrados:");
        console.log(JSON.stringify(invData, null, 2));

    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}

check();
