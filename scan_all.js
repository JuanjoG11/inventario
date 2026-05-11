async function scanAll() {
    const SUPABASE_URL = 'https://shbtmkeyarqppasdpzxv.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYnRta2V5YXJxcHBhc2Rwenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjEzODQsImV4cCI6MjA4NzQzNzM4NH0.Z4Bqo7NHUNs736UBbSG79OEwXEPQvG9ZUrgemLEquGQ';

    const tables = ['products', 'inventory', 'variants', 'product_stocks', 'items'];
    
    for (const table of tables) {
        try {
            console.log(`📡 Escaneando tabla: ${table}...`);
            const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=10`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                // Buscar cualquier campo que parezca stock y tenga un valor > 0
                const hasStock = data.some(row => {
                    return Object.values(row).some(val => typeof val === 'number' && val > 0) ||
                           (row.sizes && row.sizes.includes('"stock":'));
                });
                
                if (hasStock) {
                    console.log(`✅ ¡DATOS ENCONTRADOS EN ${table.toUpperCase()}!`);
                    console.log(JSON.stringify(data, null, 2));
                    return;
                }
            }
        } catch (e) { }
    }
    console.log("❌ No se encontraron datos de stock en ninguna tabla común.");
}

scanAll();
