const readline = require('readline');
const chalk = require('chalk');

// ==========================
//Catálogo de productos
// ==========================
const productos = [
  { id: 1, nombre: "pan", precio: 2.50, categoria: "panaderia" },
  { id: 2, nombre: "leche", precio: 3.80, categoria: "lacteos" },
  { id: 3, nombre: "queso", precio: 7.50, categoria: "lacteos" },
  { id: 4, nombre: "galletas", precio: 4.20, categoria: "snacks" },
  { id: 5, nombre: "gaseosa", precio: 3.00, categoria: "bebidas" },
  { id: 6, nombre: "cafe", precio: 6.50, categoria: "bebidas" },
  { id: 7, nombre: "jugo", precio: 4.80, categoria: "bebidas" },
  { id: 8, nombre: "mantequilla", precio: 5.20, categoria: "lacteos" },
  { id: 9, nombre: "croissant", precio: 3.00, categoria: "panaderia" }
];


// ==========================
//Variables del sistema
// ==========================
let carrito = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ==========================
//Buscar producto
// ==========================
function buscarProducto(valor) {
  return productos.find(p =>
    p.nombre.toLowerCase() === valor.toLowerCase() || p.id == valor
  );
}

// ==========================
//Agregar producto
// ==========================
function agregarAlCarrito(valor, cantidad) {
  const producto = buscarProducto(valor);
  if (!producto) {
    console.log(chalk.red("Producto no encontrado"));
    return;
  }
  if (isNaN(cantidad) || cantidad <= 0) {
    console.log(chalk.red("Cantidad inválida"));
    return;
  }

  const item = carrito.find(p => p.id === producto.id);
  if (item) {
    item.cantidad += cantidad;
  } else {
    carrito.push({ ...producto, cantidad });
  }

  console.log(chalk.green(`${producto.nombre} agregado (${cantidad} x S/${producto.precio})`));
}

// ==========================
//Eliminar producto del carrito
// ==========================
function eliminarDelCarrito(valor) {
  const index = carrito.findIndex(p => p.nombre.toLowerCase() === valor.toLowerCase() || p.id == valor);
  if (index !== -1) {
    const eliminado = carrito.splice(index, 1)[0];
    console.log(chalk.green(`Producto "${eliminado.nombre}" eliminado del carrito.`));
  } else {
    console.log(chalk.red(" Producto no encontrado en el carrito."));
  }
}


// ==========================
//Ver carrito
// ==========================
function verCarrito() {
  if (carrito.length === 0) {
    console.log(chalk.yellow("El carrito está vacío."));
    return;
  }
  console.log(chalk.blue("\n--- CARRITO ACTUAL ---"));
  carrito.forEach((p, i) => {
    const subtotal = p.precio * p.cantidad;
    console.log(`${i + 1}. ${p.nombre} - Cant: ${p.cantidad} - Subtotal: S/${subtotal.toFixed(2)}`);
  });
}

// ==========================
//Calcular totales
// ==========================
function calcularTotales() {
  let subtotal = carrito.reduce((s, p) => s + p.precio * p.cantidad, 0);
  let descuento = 0;

  if (subtotal > 100) descuento = subtotal * 0.15;
  else if (subtotal >= 50) descuento = subtotal * 0.10;
  else if (subtotal >= 20) descuento = subtotal * 0.05;

  const igv = (subtotal - descuento) * 0.18;
  const total = subtotal - descuento + igv;

  return { subtotal, descuento, igv, total };
}

// ==========================
//Generar ticket
// ==========================
function generarTicket() {
  if (carrito.length === 0) {
    console.log(chalk.red("No hay productos en el carrito."));
    return;
  }

  const { subtotal, descuento, igv, total } = calcularTotales();

  console.log(chalk.blue("\n====== RESUMEN DE COMPRA ======"));
  console.log("Producto\tCant.\tPrecio\tSubtotal");
  console.log("--------------------------------");

  carrito.forEach(p => {
    const sub = p.precio * p.cantidad;
    console.log(`${p.nombre}\t${p.cantidad}\t${p.precio.toFixed(2)}\t${sub.toFixed(2)}`);
  });

  console.log("--------------------------------");
  console.log(chalk.yellow(`Subtotal: S/${subtotal.toFixed(2)}`));
  console.log(chalk.yellow(`Descuento: S/${descuento.toFixed(2)}`));
  console.log(chalk.yellow(`IGV (18%): S/${igv.toFixed(2)}`));
  console.log(chalk.green(`TOTAL FINAL: S/${total.toFixed(2)}`));
  console.log("¡Gracias por su compra!");
}

// ==========================
//Reportes
// ==========================
function reportes() {
  console.log(chalk.magenta("\n=== REPORTES ==="));

  // Top 3 productos más caros
  const top3 = [...productos].sort((a, b) => b.precio - a.precio).slice(0, 3);
  console.log(chalk.yellow("\nTop 3 productos más caros:"));
  top3.forEach(p => console.log(`- ${p.nombre} (S/${p.precio})`));

  // Más vendidos
  const vendidos = [...carrito].sort((a, b) => b.cantidad - a.cantidad);
  if (vendidos.length > 0) {
    console.log(chalk.yellow("\nMás vendidos:"));
    vendidos.forEach(p => console.log(`- ${p.nombre}: ${p.cantidad} unidades`));
  }

  // Resumen carrito
  const totalItems = carrito.reduce((s, p) => s + p.cantidad, 0);
  const monto = carrito.reduce((s, p) => s + p.precio * p.cantidad, 0);
  console.log(chalk.yellow(`\nResumen carrito: ${totalItems} ítems, S/${monto.toFixed(2)}`));
}

// ==========================
//Vaciar carrito
// ==========================
function vaciarCarrito() {
  carrito = [];
  console.log(chalk.green("Carrito vaciado."));
}

// ==========================
// Menú principal
// ==========================
function mostrarMenu() {
  console.log(`
===== MENÚ PRINCIPAL =====
1. Registrar venta
2. Listar productos
3. Buscar producto
4. Ver carrito
5. Calcular total
6. Generar ticket
7. Reportes
8. Salir
`);
}

function menu() {
  mostrarMenu();
  rl.question("Seleccione una opción: ", op => {
    switch (op) {
      case "1":
        rl.question("Ingrese nombre o ID del producto: ", p => {
          rl.question("Cantidad: ", c => {
            agregarAlCarrito(p, Number(c));
            menu();
          });
        });
        break;
      case "2":
        console.table(productos);
        menu();
        break;
      case "3":
        rl.question("Ingrese nombre del producto: ", p => {
          const encontrado = buscarProducto(p);
          if (encontrado)
            console.log(`Producto: ${encontrado.nombre}, Precio: S/${encontrado.precio}, Categoría: ${encontrado.categoria}`);
          else
            console.log(chalk.red("Producto no encontrado."));
          menu();
        });
        break;
      case "4":
        verCarrito();
        rl.question("¿Desea eliminar un producto? (s/n): ", res => {
          if (res.toLowerCase() === "s") {
            rl.question("Ingrese nombre o ID del producto a eliminar: ", val => {
              eliminarDelCarrito(val);
              menu();
            });
          } else {
            menu();
          }
        });
        break;
      case "5":
        rl.question("¿Desea vaciar el carrito completo? (s/n): ", r => {
          if (r.toLowerCase() === "s") vaciarCarrito();
          menu();
        });
        break;
      case "6":
        generarTicket();
        menu();
        break;
      case "7":
        reportes();
        menu();
        break;
      case "8":
        console.log(" ¡Hasta luego!");
        rl.close();
        break;
      default:
        console.log(chalk.red("Opción no válida, por favor intente nuevamente."));
        menu();
    }
  });
}

// ==========================
// Iniciar programa
// ==========================
console.log(" Bienvenido al sistema Delicia ");
menu();
