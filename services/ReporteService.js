// services/ReporteService.js
/**
 * ReporteService
 * Se encarga de generar reportes en consola a partir del catálogo, ventas o carrito.
 * No modifica datos, solo muestra información formateada.
 */

const chalk = require("chalk");

class ReporteService {
  /**
   * Muestra los productos más caros del catálogo.
   * @param {Catalogo} catalogo
   * @param {number} n - cantidad de productos a mostrar
   */
  static topMasCaros(catalogo, n = 3) {
    const lista = catalogo.listar()
      .sort((a, b) => b.precio - a.precio)
      .slice(0, n);

    console.log(chalk.yellow(`\nTop ${n} productos más caros:`));
    lista.forEach((p) =>
      console.log(`- ${p.nombre}: S/${p.precio.toFixed(2)} (${p.categoria})`)
    );
  }

  /**
   * Muestra los productos más vendidos según una lista de ventas.
   * @param {Array<ItemCarrito>} ventas
   */
  static masVendidos(ventas) {
    if (!ventas || ventas.length === 0) {
      console.log(chalk.yellow("No hay ventas registradas."));
      return;
    }

    // Agrupar por producto
    const map = new Map();
    for (const item of ventas) {
      const id = item.producto.id;
      const actual = map.get(id) || { nombre: item.producto.nombre, cantidad: 0 };
      actual.cantidad += item.cantidad;
      map.set(id, actual);
    }

    // Ordenar de mayor a menor
    const lista = Array.from(map.values()).sort((a, b) => b.cantidad - a.cantidad);

    console.log(chalk.yellow("\nProductos más vendidos:"));
    lista.forEach((p) => console.log(`- ${p.nombre}: ${p.cantidad} unidades`));
  }

  /**
   * Resumen del carrito: cantidad total de ítems y monto acumulado
   * @param {Carrito} carrito
   */
  static resumenCarrito(carrito) {
    const items = carrito.items();
    if (items.length === 0) {
      console.log(chalk.yellow("El carrito está vacío."));
      return;
    }

    const totalItems = items.reduce((s, it) => s + it.cantidad, 0);
    const monto = items.reduce((s, it) => s + it.subtotal(), 0);

    console.log(chalk.cyan(`\nResumen del carrito:`));
    console.log(`Total de ítems: ${totalItems}`);
    console.log(`Monto acumulado: S/${monto.toFixed(2)}`);
  }
}

module.exports = ReporteService;
