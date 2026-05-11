async function patchInventory() {
    const SUPABASE_URL = 'https://shbtmkeyarqppasdpzxv.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYnRta2V5YXJxcHBhc2Rwenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjEzODQsImV4cCI6MjA4NzQzNzM4NH0.Z4Bqo7NHUNs736UBbSG79OEwXEPQvG9ZUrgemLEquGQ';

    console.log("🩹 Aplicando parche de emergencia: Stock = 3 para todos los productos...");

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/inventory?location_id=eq.0`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                stock: 3,
                updated_at: new Date()
            })
        });

        if (response.ok) {
            console.log("✅ ¡PARCHE APLICADO! La tienda ya no está agotada.");
            console.log("🚀 Todos los productos tienen ahora 3 unidades de stock temporal.");
        } else {
            console.log("❌ Error al aplicar el parche:", response.status);
        }

    } catch (e) {
        console.error("❌ Error crítico:", e.message);
    }
}

patchInventory();
