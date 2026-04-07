const fs = require('fs');
const products = require('./db_products_current.json');

// Generar listado simplificado: solo nombres únicos
let csvContent = '\ufeff'; // BOM para que Excel reconozca tildes
csvContent += 'Producto;Detalles_Inventario_Real\n';

const namesSeen = new Set();
const uniqueNames = products
    .map(p => p.name.trim())
    .filter(name => {
        if (namesSeen.has(name)) return false;
        namesSeen.add(name);
        return true;
    }).sort();

uniqueNames.forEach(name => {
    csvContent += `"${name}";""\n`; // Dejar la columna derecha vacía para que escriban libremente
});

fs.writeFileSync('PLANTILLA_INVENTARIO_SIMPLIFICADA.csv', csvContent);
console.log('✅ Plantilla simplificada creada: PLANTILLA_INVENTARIO_SIMPLIFICADA.csv');
