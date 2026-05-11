async function checkToday() {
    const SUPABASE_URL = 'https://shbtmkeyarqppasdpzxv.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYnRta2V5YXJxcHBhc2Rwenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjEzODQsImV4cCI6MjA4NzQzNzM4NH0.Z4Bqo7NHUNs736UBbSG79OEwXEPQvG9ZUrgemLEquGQ';

    console.log("🔍 Buscando cambios realizados HOY (11 de Mayo)...");

    try {
        // Buscar registros actualizados hoy en la tabla inventory
        const response = await fetch(`${SUPABASE_URL}/rest/v1/inventory?select=*,products(name)&updated_at=gte.2026-05-11T00:00:00&limit=10`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        const data = await response.json();

        if (data.length === 0) {
            console.log("ℹ️ No se encontraron registros actualizados hoy en 'inventory'.");
        } else {
            console.log(`✅ Se encontraron ${data.length} registros actualizados hoy:`);
            console.log(JSON.stringify(data, null, 2));
        }

    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}

checkToday();
