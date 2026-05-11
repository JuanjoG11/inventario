async function checkOtherSedes() {
    const SUPABASE_URL = 'https://shbtmkeyarqppasdpzxv.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYnRta2V5YXJxcHBhc2Rwenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjEzODQsImV4cCI6MjA4NzQzNzM4NH0.Z4Bqo7NHUNs736UBbSG79OEwXEPQvG9ZUrgemLEquGQ';

    console.log("🔍 Buscando stock en Sedes 1, 2, 3 y 4...");

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/inventory?select=*,products(name)&location_id=gt.0&stock=gt.0&limit=20`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        const data = await response.json();

        if (data.length === 0) {
            console.log("❌ No hay stock en ninguna sede individual.");
        } else {
            console.log(`✅ ¡ENCONTRADO! Hay stock en sedes individuales:`);
            console.log(JSON.stringify(data, null, 2));
        }

    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}

checkOtherSedes();
