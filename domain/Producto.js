// domain/Producto.js
/**
 * Clase Producto
 * Representa un producto del catálogo.
 * Incluye métodos para formatear su precio o convertirlo a JSON.
 */
class Producto {
    constructor(id, nombre, precio, categoria) {
      this.id = id;
      this.nombre = nombre;
      this.precio = precio;
      this.categoria = categoria;
    }
  
    /** Devuelve el precio formateado a dos decimales con prefijo S/ */
    precioFormateado() {
      return `S/${this.precio.toFixed(2)}`;
    }
  
    /** Convierte el objeto a formato JSON (útil para mostrar o exportar) */
    toJSON() {
      return {
        id: this.id,
        nombre: this.nombre,
        precio: this.precio,
        categoria: this.categoria
      };
    }
  }
  
  module.exports = Producto;
  