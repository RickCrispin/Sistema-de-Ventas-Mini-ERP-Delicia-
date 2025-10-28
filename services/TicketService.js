// services/TicketService.js
/**
 * TicketService
 * Se encarga de mostrar un resumen de compra (ticket) en consola con formato.
 * Utiliza colores para resaltar los totales y los datos principales.
 */

const chalk = require("chalk");

class TicketService {
  /**
   * Muestra el ticket de compra completo
   * @param {Tienda} tienda
   * @param {Cliente} cliente
   */
  static renderTicket(tienda, cliente) {
    const carrito = tienda.carrito;
    const items = carrito.items();

    if (items.length === 0) {
      console.log(chalk.red("No hay productos en el carrito."));
      return;
    }

    console.log(chalk.blue("\n====== RESUMEN DE COMPRA ======"));
    console.log("Producto       Cant  Precio    Subtotal");
    console.log("---------------------------------------");

    items.forEach((it) => {
      console.log(
        `${it.producto.nombre.padEnd(14)} ${String(it.cantidad).padEnd(5)} S/${it.producto.precio
          .toFixed(2)
          .padEnd(8)} S/${it.subtotal().toFixed(2)}`
      );
    });

    console.log("---------------------------------------");
    const subtotal = carrito.subtotal();
    const descuento = carrito.descuentoEscalonado();
    const igv = carrito.igv();
    const total = carrito.total();

    console.log(chalk.yellow(`Subtotal: S/${subtotal.toFixed(2)}`));
    console.log(chalk.yellow(`Descuento: S/${descuento.toFixed(2)}`));
    console.log(chalk.yellow(`IGV (18%): S/${igv.toFixed(2)}`));
    console.log(chalk.greenBright(`TOTAL FINAL: S/${total.toFixed(2)}`));
    console.log(chalk.green("\nGracias por su compra, " + cliente.nombre + "!"));
  }
}

module.exports = TicketService;
