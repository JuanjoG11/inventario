const fs = require('fs');
const products = require('./db_products_current.json');

// Generar todas las combinaciones Producto x Talla
let csvContent = '\ufeff'; // BOM para que Excel reconozca tildes
csvContent += 'Producto;Talla;Stock_Real_Verificado\n';

const namesSeen = new Set();
const uniqueProducts = products.filter(p => {
    if (namesSeen.has(p.name)) return false;
    namesSeen.add(p.name);
    return true;
}).sort((a,b) => a.name.localeCompare(b.name));

uniqueProducts.forEach(product => {
    const sizes = Array.isArray(product.sizes) ? product.sizes : ['Única'];
    sizes.forEach(size => {
        // Dejamos el stock vacío o con un 0 para que ellos lo rellenen
        csvContent += `"${product.name}";"${size}";0\n`;
    });
});

fs.writeFileSync('PLANTILLA_INVENTARIO_REAL.csv', csvContent);
console.log('✅ Plantilla creada con éxito: PLANTILLA_INVENTARIO_REAL.csv');
