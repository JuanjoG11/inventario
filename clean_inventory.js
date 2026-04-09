
const SUPABASE_URL = 'https://shbtmkeyarqppasdpzxv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYnRta2V5YXJxcHBhc2Rwenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjEzODQsImV4cCI6MjA4NzQzNzM4NH0.Z4Bqo7NHUNs736UBbSG79OEwXEPQvG9ZUrgemLEquGQ';

async function cleanInventory() {
    console.log("🧹 Iniciando limpieza total de inventario (via REST API)...");
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/inventory?id=neq.-1`, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log("✅ Inventario vaciado correctamente. Todos los productos aparecerán con stock 0.");
        } else {
            const errText = await response.text();
            console.error("❌ Error al limpiar:", response.status, errText);
        }
    } catch (e) {
        console.error("❌ Error de red:", e.message);
    }
}

cleanInventory();
