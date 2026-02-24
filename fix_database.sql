-- 1. Habilitar permisos de borrado
CREATE POLICY "Public Delete Inventory" ON inventory FOR DELETE USING (true);
CREATE POLICY "Public Delete Products" ON products FOR DELETE USING (true);

-- 2. Limpiar todo lo que está bloqueando
DELETE FROM inventory;
DELETE FROM products;

-- 3. Evitar que esto pase de nuevo (Añadir restricción de duplicados)
ALTER TABLE inventory ADD CONSTRAINT inventory_unique_combination UNIQUE (product_id, location_id, size);
