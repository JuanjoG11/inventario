async function findMovements() {
    const SUPABASE_URL = 'https://shbtmkeyarqppasdpzxv.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYnRta2V5YXJxcHBhc2Rwenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjEzODQsImV4cCI6MjA4NzQzNzM4NH0.Z4Bqo7NHUNs736UBbSG79OEwXEPQvG9ZUrgemLEquGQ';

    console.log("🔍 Buscando tablas de movimientos o historial...");

    const tables = ['inventory_movements', 'stock_movements', 'logs', 'audit_log', 'movements'];
    
    for (const table of tables) {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ ¡Tabla encontrada!: ${table}`);
                console.log(JSON.stringify(data, null, 2));
                return;
            }
        } catch (e) { }
    }
    console.log("❌ No se encontraron tablas de movimientos automáticas.");
}

findMovements();
