async function checkSalesColumns() {
    const SUPABASE_URL = 'https://shbtmkeyarqppasdpzxv.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYnRta2V5YXJxcHBhc2Rwenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjEzODQsImV4cCI6MjA4NzQzNzM4NH0.Z4Bqo7NHUNs736UBbSG79OEwXEPQvG9ZUrgemLEquGQ';

    console.log("🔍 Investigando la tabla de VENTAS para buscar rastros de stock...");

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/sales?select=*&limit=1`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        const data = await response.json();

        if (data.length > 0) {
            console.log("✅ Columnas de la tabla de VENTAS:");
            console.log(Object.keys(data[0]));
            console.log("\nEjemplo de un registro de venta:");
            console.log(JSON.stringify(data[0], null, 2));
        } else {
            console.log("❌ No hay ventas para analizar.");
        }

    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}

checkSalesColumns();
