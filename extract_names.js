const fs = require('fs');
const products = require('./db_products_current.json');
const names = [...new Set(products.map(p => p.name.trim()))].sort();
fs.writeFileSync('NOMBRES_PRODUCTOS.txt', names.join('\n'));
console.log(`✅ Se han guardado ${names.length} nombres únicos en NOMBRES_PRODUCTOS.txt`);
