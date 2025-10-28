// domain/Carrito.js
/**
 * Clase Carrito
 * Encapsula un arreglo privado de items (ItemCarrito[])
 * y provee métodos para agregar, eliminar, vaciar y calcular totales.
 */

const ItemCarrito = require("./ItemCarrito");

class Carrito {
  #items = [];

  /** Devuelve una copia del array de ítems */
  items() {
    return [...this.#items];
  }

  /** Agrega un producto al carrito (si ya existe, acumula cantidad) */
  agregar(producto, cantidad) {
    const existente = this.#items.find(
      (it) => it.producto.id === producto.id
    );

    if (existente) {
      existente.cantidad += cantidad;
    } else {
      this.#items.push(new ItemCarrito(producto, cantidad));
    }
  }

  /** Elimina un ítem del carrito por su ID */
  eliminarPorId(id) {
    const indice = this.#items.findIndex((it) => it.producto.id === id);
    if (indice >= 0) {
      this.#items.splice(indice, 1);
      return true;
    }
    return false;
  }

  /** Vacía completamente el carrito */
  vaciar() {
    this.#items = [];
  }

  /** Suma todos los subtotales */
  subtotal() {
    return this.#items.reduce((acc, it) => acc + it.subtotal(), 0);
  }

  /**
   * Calcula descuento escalonado sobre el subtotal:
   * >=100 → 15%, 50–99.99 → 10%, 20–49.99 → 5%, <20 → 0%
   */
  descuentoEscalonado() {
    const sub = this.subtotal();
    if (sub >= 100) return sub * 0.15;
    if (sub >= 50) return sub * 0.1;
    if (sub >= 20) return sub * 0.05;
    return 0;
  }

  /** IGV del 18% aplicado después del descuento */
  igv() {
    const base = this.subtotal() - this.descuentoEscalonado();
    return base * 0.18;
  }

  /** Total final = (subtotal - descuento) + IGV */
  total() {
    return this.subtotal() - this.descuentoEscalonado() + this.igv();
  }
}

module.exports = Carrito;
