// core/TiendaOnline.js
/**
 * Clase TiendaOnline
 * Extiende a Tienda agregando funciones de interacción con el usuario por consola.
 * Utiliza readline para mostrar menús y ejecutar acciones del sistema.
 */

const readline = require("readline");
const chalk = require("chalk");
const Tienda = require("./Tienda");

class TiendaOnline extends Tienda {
  constructor(nombre = "Delicia") {
    super(nombre);

    // Configurar consola interactiva
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /** Helper para preguntar (async/await friendly) */
  preguntar(texto) {
    return new Promise((resolve) => this.rl.question(texto, resolve));
  }

  /** Muestra lista de productos en consola */
  listarProductos() {
    const productos = this.catalogo.listar();
    console.log(chalk.cyan("\n--- LISTA DE PRODUCTOS ---"));
    console.log("ID  Producto       Categoria    Precio");
    console.log("---------------------------------------");
    productos.forEach((p) => {
      console.log(
        `${String(p.id).padEnd(3)} ${p.nombre.padEnd(14)} ${p.categoria.padEnd(
          12
        )} S/${p.precio.toFixed(2)}`
      );
    });
  }

  /** Muestra el menú principal */
  mostrarMenu() {
    console.log(chalk.greenBright(`
===== MENU PRINCIPAL (${this.nombre}) =====
1. Registrar venta
2. Listar productos
3. Buscar producto
4. Ver carrito
5. Vaciar carrito
6. Generar ticket
7. Reportes
8. Listar por categoría
9. Salir
`));
  }

  /** Ejecuta la lógica del menú */
  async iniciar() {
    console.log(chalk.green(`Bienvenido a la tienda ${this.nombre}`));
    await this.menuLoop();
  }

  /** Flujo principal del menú */
  async menuLoop() {
    this.mostrarMenu();
    const op = String(await this.preguntar("Seleccione una opción: ")).trim();

    switch (op) {
      case "1": {
        const p = await this.preguntar("Ingrese nombre o ID del producto: ");
        const c = await this.preguntar("Cantidad: ");
        this.agregarAlCarrito(p, Number(c));
        break;
      }
      case "2":
        this.listarProductos();
        break;
      case "3": {
        const p = await this.preguntar("Ingrese nombre o ID del producto: ");
        const prod = this.buscarProducto(p);
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
        const items = this.carrito.items();
        if (items.length === 0) {
          console.log(chalk.yellow("El carrito está vacío."));
        } else {
          console.log(chalk.blue("\n--- CARRITO ---"));
          items.forEach((it, i) => {
            console.log(
              `${i + 1}. ${it.producto.nombre} x${it.cantidad} - S/${(
                it.subtotal()
              ).toFixed(2)}`
            );
          });
        }
        const resp = String(await this.preguntar("¿Eliminar producto? (s/n): ")).trim().toLowerCase();
        if (resp === "s") {
          const val = await this.preguntar("Ingrese nombre o ID: ");
          this.eliminarDelCarrito(val);
        }
        break;
      }
      case "5": {
        const r = String(await this.preguntar("¿Vaciar carrito? (s/n): ")).trim().toLowerCase();
        if (r === "s") this.vaciarCarrito();
        break;
      }
      case "6":
        console.log(chalk.cyan("⚙️  Generando ticket... (usa TicketService)"));
        break;
      case "7":
        console.log(chalk.cyan("📊 Generando reportes... (usa ReporteService)"));
        break;
      case "8": {
        const cat = await this.preguntar("Ingrese categoría: ");
        const lista = this.catalogo.filtrarPorCategoria(cat);
        if (lista.length === 0)
          console.log(chalk.red("No hay productos en esa categoría."));
        else
          lista.forEach((p) =>
            console.log(`- ${p.nombre} (S/${p.precio.toFixed(2)})`)
          );
        break;
      }
      case "9":
        console.log(chalk.green("Hasta luego!"));
        this.rl.close();
        return;
      default:
        console.log(chalk.red("Opción no válida."));
    }

    await this.menuLoop();
  }
}

module.exports = TiendaOnline;
