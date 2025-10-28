// core/Tienda.js
/**
 * Clase Tienda
 * Representa la base de una tienda: maneja catálogo, carrito y operaciones básicas.
 * Esta clase puede ser extendida (por ejemplo, TiendaOnline).
 */

const Catalogo = require("../domain/Catalogo");
const Carrito = require("../domain/Carrito");
const Cliente = require("../domain/Cliente");

class Tienda {
  constructor(nombre = "Delicia") {
    this.nombre = nombre;
    this.catalogo = new Catalogo();
    this.carrito = new Carrito();
    this.cliente = new Cliente(); // cliente por defecto
  }

  /** Permite asignar un cliente actual */
  setCliente(nombre, correo = "") {
    this.cliente = new Cliente(nombre, correo);
  }

  /** Busca un producto dentro del catálogo */
  buscarProducto(valor) {
    return this.catalogo.buscar(valor);
  }

  /** Agrega un producto al carrito */
  agregarAlCarrito(valor, cantidad) {
    const producto = this.buscarProducto(valor);
    if (!producto) {
      console.log("Producto no encontrado.");
      return;
    }

    if (isNaN(cantidad) || cantidad <= 0) {
      console.log("Cantidad inválida.");
      return;
    }

    this.carrito.agregar(producto, Number(cantidad));
    console.log(`${producto.nombre} agregado (${cantidad} unidad(es)).`);
  }
 
  /** Elimina producto del carrito */
  eliminarDelCarrito(valor) {
    const producto = this.buscarProducto(valor);
    if (!producto) {
      console.log("Producto no encontrado.");
      return;
    }

    const ok = this.carrito.eliminarPorId(producto.id);
    if (ok) console.log(`Producto "${producto.nombre}" eliminado.`);
    else console.log("Ese producto no estaba en el carrito.");
  }

  /** Vacía el carrito */
  vaciarCarrito() {
    this.carrito.vaciar();
    console.log("🧹 Carrito vaciado.");
  }

  /** Devuelve el estado del carrito */
  verCarrito() {
    return this.carrito.items();
  }

  /** Muestra resumen de totales */
  verTotales() {
    const sub = this.carrito.subtotal();
    const desc = this.carrito.descuentoEscalonado();
    const igv = this.carrito.igv();
    const tot = this.carrito.total();
    return { sub, desc, igv, tot };
  }
}

module.exports = Tienda;
