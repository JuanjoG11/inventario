# 📒 Guía Maestra: Sistema de Inventario Centralizado Tennis y Mas

Bienvenido al centro de operaciones de **Tennis y Mas**. Este ecosistema ha sido diseñado para unificar tus tiendas físicas y tu tienda virtual en una sola base de datos inteligente.

---

## 🔑 1. Acceso y Seguridad (PINs)

La aplicación utiliza un sistema de perfiles por sede. Cada sede tiene un **PIN de 4 dígitos** que define desde dónde se están realizando los movimientos.

| 📍 Sede / Ubicación | 🛡️ PIN de Acceso | 🏢 Función |
| :--- | :---: | :--- |
| **Fantasías New York** | `1111` | Venta al público (Local 1) |
| **Sede Bulevar** | `2222` | Venta al público (Local 2) |
| **Sede Virtual / Admin** | `3333` | Control Central / Web y Bodega |

> [!TIP]
> **Instalación como App**: Abre el sistema en tu navegador móvil (Chrome o Safari) y selecciona **"Agregar a la pantalla de inicio"**. Tendrás el icono de Tennis y Mas en tu celular como cualquier otra App.

---

## 📊 2. El Dashboard Inteligente

El Dashboard es tu torre de control. Aquí ves todo lo que tienes, pero con "ojos de jefe".

*   **Vista Global**: Los números grandes que ves representan el **Stock Total** (la suma de todas las sedes).
*   **Desglose por Sede**: Si quieres saber exactamente *dónde* está un producto:
    *   **En PC**: Pasa el ratón sobre la talla (el cuadro rojo/gris).
    *   **En Móvil**: Mantén presionado un segundo sobre la talla.
    *   Aparecerá un mensaje indicando cuántos hay en NY, cuántos en Bulevar y cuántos en Bodega.

---

## 🛒 3. Registro de Ventas (Locales)

Para vender, simplemente **toca la foto del producto** en el Dashboard.

1.  **Selección de Talla**: Al abrir el selector de tallas, verás algo como `Talla 40 (Total: 7) [NY: 5 | Bulevar: 2]`. 
2.  **Lógica del Sistema**: El sistema es inteligente. Si estás logeado en "Bulevar", restará primero de esa sede. Si no hay ahí, restará de la sede que tenga disponibles.
3.  **Historial**: Cada venta queda guardada con fecha, hora y sede en el módulo de **"Historial"**.

---

## 🛠️ 4. Gestión de Catálogo y Bodega

¿Llegó mercancía nueva? Usa el módulo **"Gestión Stock"**.

*   **Actualización Masiva**: Selecciona un producto y podrás añadir todas las tallas nuevas de una sola vez.
*   **Sincronización Web**: Todo lo que modifiques aquí se verá reflejado en la página web automáticamente en pocos segundos.

---

## 🌐 5. Sincronización con Pedidos Web (Addi/Web)

Cuando un cliente compra por la página web, el pedido aparece en tu **Panel Administrativo Web** (`admin.html`).

1.  Revisa los pedidos nuevos en la pestaña de **Pedidos**.
2.  Busca el icono de **Check Amarillo (✓)** junto al pedido.
3.  Púlsalo una vez hayas despachado el paquete. 

> [!CAUTION]
> **¡Acción Crucial!**: Al pulsar el check amarillo, el sistema descuenta los productos del inventario central. Si no lo pulsas, el stock seguirá apareciendo disponible en la App y podrías venderlo dos veces.

---

## 🔄 6. Sincronización Realtime (En Vivo)

*   **Venta en Tienda**: Descuenta de la web al instante.
*   **Ajuste en Gestión**: Actualiza los precios y tallas en la web al instante.
*   **Venta en Web**: Te avisa a la App de inventario con un mensaje: *"Inventario actualizado (Venta Web)"*.

---

## ❓ Preguntas Frecuentes

**¿Qué pasa si vendo una talla que aparece en cero?**
El sistema te permitirá registrarla pero dejará el stock en **negativo (-1)**. Esto le indica al administrador que hubo un error de conteo físico y debe ajustarse.

**¿Las fotos no cargan?**
Asegúrate de tener una conexión a internet estable. Si el problema persiste, verifica en el Panel Admin que el link de la imagen sea correcto.

---
*© 2026 Tennis y Mas - Sistema de Gestión de Inventario de Alto Rendimiento.*
