async function findTheThree() {
    const SUPABASE_URL = 'https://shbtmkeyarqppasdpzxv.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYnRta2V5YXJxcHBhc2Rwenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjEzODQsImV4cCI6MjA4NzQzNzM4NH0.Z4Bqo7NHUNs736UBbSG79OEwXEPQvG9ZUrgemLEquGQ';

    console.log("🔍 Buscando el número '3' en toda la base de datos para el producto 92...");

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/inventory?product_id=eq.92&stock=eq.3`, {
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        });
        const data = await response.json();
        
        if (data.length > 0) {
            console.log("✅ ¡LO ENCONTRÉ! El stock se guarda en la tabla INVENTORY.");
            console.log(JSON.stringify(data, null, 2));
        } else {
            console.log("❌ No está en 'inventory'. Buscando en otras tablas...");
            // Buscar en todas las tablas por product_id 92
        }
    } catch (e) {
        console.error(e.message);
    }
}

findTheThree();
