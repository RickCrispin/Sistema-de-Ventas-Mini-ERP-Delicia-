// app.js
/**
 * Mini-ERP Delicia
 * Aplicación de consola que simula la gestión de ventas de una panadería-pastelería.
 * Autor: Estudiante
 * 
 * Módulos principales:
 * - core/TiendaOnline.js  → Control del flujo interactivo
 * - services/TicketService.js  → Generación del ticket
 * - services/ReporteService.js → Reportes de productos y ventas
 * 
 * Ejecución: node app.js
 */

const chalk = require("chalk");
const TiendaOnline = require("./core/TiendaOnline");
const TicketService = require("./services/TicketService");
const ReporteService = require("./services/ReporteService");

// Crear una instancia de la tienda en línea
const tienda = new TiendaOnline("Delicia");

/**
 * Función principal del sistema.
 * Controla el flujo del menú y usa los servicios externos.
 */
async function main() {
  console.log(chalk.greenBright("Bienvenido al sistema Mini-ERP Delicia"));

  // Pregunta nombre del cliente antes de empezar
  const nombre = await tienda.preguntar("Ingrese su nombre: ");
  tienda.setCliente(nombre);

  // Bucle del menú principal
  async function menu() {
    tienda.mostrarMenu();
    const op = String(await tienda.preguntar("Seleccione una opción: ")).trim();

    switch (op) {
      case "1": {
        const p = await tienda.preguntar("Ingrese nombre o ID del producto: ");
        const c = await tienda.preguntar("Cantidad: ");
        tienda.agregarAlCarrito(p, Number(c));
        break;
      }

      case "2":
        tienda.listarProductos();
        break;

      case "3": {
        const p = await tienda.preguntar("Ingrese nombre o ID del producto: ");
        const prod = tienda.buscarProducto(p);
        if (prod)
          console.log(
            chalk.yellow(
              `Producto: ${prod.nombre} | Precio: S/${prod.precio.toFixed(
                2
              )} | Categoría: ${prod.categoria}`
            )
          );
        else console.log(chalk.red("Producto no encontrado."));
        break;
      }

      case "4": {
        const items = tienda.carrito.items();
        if (items.length === 0) {
          console.log(chalk.yellow("El carrito está vacío."));
        } else {
          console.log(chalk.blue("\n--- CARRITO ---"));
          console.log("Producto       Cant  Precio    Subtotal");
          console.log("---------------------------------------");
          items.forEach((it) => {
            console.log(
              `${it.producto.nombre.padEnd(14)} ${String(it.cantidad).padEnd(5)} S/${it.producto.precio
                .toFixed(2)
                .padEnd(8)} S/${it.subtotal().toFixed(2)}`
            );
          });
        }
        const resp = String(await tienda.preguntar("¿Eliminar producto? (s/n): ")).trim().toLowerCase();
        if (resp === "s") {
          const val = await tienda.preguntar("Ingrese nombre o ID: ");
          tienda.eliminarDelCarrito(val);
        }
        break;
      }

      case "5": {
        const r = String(await tienda.preguntar("¿Vaciar carrito? (s/n): ")).trim().toLowerCase();
        if (r === "s") tienda.vaciarCarrito();
        break;
      }

      case "6": {
        // Usa TicketService para mostrar el ticket formateado
        TicketService.renderTicket(tienda, tienda.cliente);
        break;
      }

      case "7": {
        // Usa ReporteService para mostrar reportes
        ReporteService.topMasCaros(tienda.catalogo, 3);
        ReporteService.masVendidos(tienda.carrito.items());
        ReporteService.resumenCarrito(tienda.carrito);
        break;
      }

      case "8": {
        const cat = await tienda.preguntar("Ingrese categoría: ");
        const lista = tienda.catalogo.filtrarPorCategoria(cat);
        if (lista.length === 0)
          console.log(chalk.red("No hay productos en esa categoría."));
        else
          lista.forEach((p) =>
            console.log(`- ${p.nombre} (S/${p.precio.toFixed(2)})`)
          );
        break;
      }

      case "9":
        console.log(chalk.green("Hasta luego. Gracias por usar Delicia."));
        tienda.rl.close();
        return;

      default:
        console.log(chalk.red("Opción no válida. Intente nuevamente."));
    }

    // Regresar al menú principal
    await menu();
  }

  await menu();
}

// Iniciar aplicación
main();
