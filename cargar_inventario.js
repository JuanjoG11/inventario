const fs = require('fs');
const { createClient } = require('@supabase/supabase-client');

const SUPABASE_URL = 'https://shbtmkeyarqppasdpzxv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYnRta2V5YXJxcHBhc2Rwenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjEzODQsImV4cCI6MjA4NzQzNzM4NH0.Z4Bqo7NHUNs736UBbSG79OEwXEPQvG9ZUrgemLEquGQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function upload() {
    try {
        console.log('--------------------------------------------------');
        console.log('🛡️  CARGADOR DE INVENTARIO CON RESPALDO DE SEGURIDAD');
        console.log('--------------------------------------------------');

        // 1. Leer el archivo Excel (CSV)
        if (!fs.existsSync('RECONSTRUCCION_INVENTARIO.csv')) {
            console.error('❌ Error: No se encuentra el archivo RECONSTRUCCION_INVENTARIO.csv');
            return;
        }

        const content = fs.readFileSync('RECONSTRUCCION_INVENTARIO.csv', 'utf8');
        const lines = content.split('\n').slice(1);
        
        let count = 0;
        const backupData = [];

        for (let line of lines) {
            if (!line.trim()) continue;
            const parts = line.split(';');
            if (parts.length < 5) continue;

            const id = parts[0];
            const name = parts[1].replace(/"/g, '');
            const size = parts[2].replace(/"/g, '');
            const stockReal = parseInt(parts[4]);

            if (isNaN(stockReal)) continue;

            process.stdout.write(`\r📤 Cargando: ${name.substring(0, 20)}...`);

            // 2. Guardar en el array de respaldo local
            backupData.push({ id, name, size, stock: stockReal, date: new Date().toISOString() });

            // 3. Subir a Supabase (Upsert seguro)
            await supabase.from('inventory')
                .upsert({
                    product_id: id,
                    location_id: 0,
                    size: size,
                    stock: stockReal,
                    updated_at: new Date()
                }, { onConflict: 'product_id,location_id,size' });

            count++;
        }

        // 4. CREAR COPIA DE SEGURIDAD LOCAL
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFileName = `RESPALDO_INVENTARIO_${timestamp}.json`;
        fs.writeFileSync(backupFileName, JSON.stringify(backupData, null, 2));

        console.log('\n\n✅ ¡CARGA COMPLETADA!');
        console.log(`- Se han actualizado ${count} registros.`);
        console.log(`- Se ha creado un respaldo local: ${backupFileName}`);
        console.log('Ya puedes entrar a la App y ver los números reales.');
        console.log('--------------------------------------------------');
    } catch (err) {
        console.error('\n❌ Error crítico:', err.message);
    }
}

upload();
