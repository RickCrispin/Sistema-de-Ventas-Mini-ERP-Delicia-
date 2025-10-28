// domain/Catalogo.js
/**
 * Clase Catalogo
 * Gestiona la lista de productos disponibles en la tienda.
 * Permite buscar, listar y filtrar productos.
 */

const Producto = require("./Producto");

class Catalogo {
  constructor() {
    // Catálogo inicial (podría cargarse de archivo o API)
    this.productos = [
      new Producto(1, "pan", 2.5, "panaderia"),
      new Producto(2, "leche", 3.8, "lacteos"),
      new Producto(3, "queso", 7.5, "lacteos"),
      new Producto(4, "galletas", 4.2, "snacks"),
      new Producto(5, "gaseosa", 3.0, "bebidas"),
      new Producto(6, "cafe", 6.5, "bebidas"),
      new Producto(7, "jugo", 4.8, "bebidas"),
      new Producto(8, "mantequilla", 5.2, "lacteos"),
      new Producto(9, "croissant", 3.0, "panaderia")
    ];
  }

  /** Devuelve todos los productos */
  listar() {
    return this.productos;
  }

  /** Busca un producto por id o nombre */
  buscar(valor) {
    if (typeof valor === "number" || /^\d+$/.test(String(valor))) {
      const id = Number(valor);
      return this.productos.find((p) => p.id === id);
    }
    const nombre = String(valor).trim().toLowerCase();
    return this.productos.find((p) => p.nombre.toLowerCase() === nombre);
  }

  /** Filtra productos por categoría */
  filtrarPorCategoria(cat) {
    const categoria = String(cat).trim().toLowerCase();
    return this.productos.filter(
      (p) => p.categoria.toLowerCase() === categoria
    );
  }

  /** Devuelve los 3 productos más caros */
  topMasCaros() {
    return [...this.productos]
      .sort((a, b) => b.precio - a.precio)
      .slice(0, 3);
  }
}

module.exports = Catalogo;
