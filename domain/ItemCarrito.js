// domain/ItemCarrito.js
/**
 * Clase ItemCarrito
 * Representa un ítem dentro del carrito de compras.
 * Contiene el producto y la cantidad, con métodos para calcular subtotales.
 */

class ItemCarrito {
    constructor(producto, cantidad) {
      if (!producto) throw new Error("Debe proporcionar un producto válido.");
      if (isNaN(cantidad) || cantidad <= 0)
        throw new Error("La cantidad debe ser numérica y mayor que cero.");
  
      this.producto = producto;
      this.cantidad = cantidad;
    }
  
    /** Calcula el subtotal = precio del producto * cantidad */
    subtotal() {
      return this.producto.precio * this.cantidad;
    }
  }
  
  module.exports = ItemCarrito;
  