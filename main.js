// app.js
const readline = require("readline");
const chalk = require("chalk");
 
/**
 * Catalogo de productos (sin tildes en nombres/categorias)
 * Mantener ids unico.
 */
const productos = [
  { id: 1, nombre: "pan", precio: 2.5, categoria: "panaderia" },
  { id: 2, nombre: "leche", precio: 3.8, categoria: "lacteos" },
  { id: 3, nombre: "queso", precio: 7.5, categoria: "lacteos" },
  { id: 4, nombre: "galletas", precio: 4.2, categoria: "snacks" },
  { id: 5, nombre: "gaseosa", precio: 3.0, categoria: "bebidas" },
  { id: 6, nombre: "cafe", precio: 6.5, categoria: "bebidas" },
  { id: 7, nombre: "jugo", precio: 4.8, categoria: "bebidas" },
  { id: 8, nombre: "mantequilla", precio: 5.2, categoria: "lacteos" },
  { id: 9, nombre: "croissant", precio: 3.0, categoria: "panaderia" }
];

// Estado del carrito
let carrito = [];

/** Interfaz readline */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/* ==========================
   Helpers / Utilidades
   ========================== */

/**
 * Busca un producto por nombre (exacto) o por id.
 * @param {string|number} valor - nombre o id
 * @returns {object|undefined} producto o undefined
 */
function buscarProducto(valor) {
  if (typeof valor === "number" || /^\d+$/.test(String(valor).trim())) {
    const id = Number(valor);
    return productos.find((p) => p.id === id);
  }
  const nombre = String(valor).trim().toLowerCase();
  return productos.find((p) => p.nombre.toLowerCase() === nombre);
}

/**
 * Formatea una cantidad monetaria a 2 decimales con prefijo S/
 * @param {number} num
 * @returns {string}
 */
function formatearS(num) {
  return `S/${num.toFixed(2)}`;
}

/**
 * Pide al usuario y devuelve una promesa con la respuesta (async/await friendly).
 * @param {string} pregunta
 * @returns {Promise<string>}
 */
function preguntar(pregunta) {
  return new Promise((resolve) => {
    rl.question(pregunta, (r) => resolve(r));
  });
}

/* ==========================
   Operaciones carrito
   ========================== */

/**
 * Agrega producto al carrito (por id o nombre).
 * Si ya existe, suma la cantidad.
 * @param {string|number} valor
 * @param {number} cantidad
 */
function agregarAlCarrito(valor, cantidad) {
  const producto = buscarProducto(valor);
  if (!producto) {
    console.log(chalk.red("Producto no encontrado"));
    return;
  }
  cantidad = Number(cantidad);
  if (!Number.isFinite(cantidad) || cantidad <= 0) {
    console.log(chalk.red("Cantidad invalida"));
    return;
  }

  const item = carrito.find((p) => p.id === producto.id);
  if (item) {
    item.cantidad += cantidad;
  } else {
    carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad });
  }

  console.log(chalk.green(`${producto.nombre} agregado (${cantidad} x ${formatearS(producto.precio)})`));
}

/**
 * Elimina un producto del carrito por id o nombre.
 * @param {string|number} valor
 */
function eliminarDelCarrito(valor) {
  const idx = carrito.findIndex((p) => {
    if (/^\d+$/.test(String(valor).trim())) return p.id === Number(valor);
    return p.nombre.toLowerCase() === String(valor).trim().toLowerCase();
  });

  if (idx === -1) {
    console.log(chalk.red("Producto no encontrado en el carrito"));
    return;
  }
  const eliminado = carrito.splice(idx, 1)[0];
  console.log(chalk.green(`Producto "${eliminado.nombre}" eliminado del carrito.`));
}

/**
 * Vacía el carrito
 */
function vaciarCarrito() {
  carrito = [];
  console.log(chalk.green("Carrito vaciado"));
}

/* ==========================
   Visualizacion / Reportes
   ========================== */

/**
 * Muestra el carrito con subtotales
 */
function verCarrito() {
  if (carrito.length === 0) {
    console.log(chalk.yellow("El carrito esta vacio."));
    return;
  }
  console.log(chalk.blue("\n--- CARRITO ACTUAL ---"));
  console.log(" #  Producto       Cant  Precio    Subtotal");
  console.log("------------------------------------------");
  carrito.forEach((p, i) => {
    const subtotal = p.precio * p.cantidad;
    console.log(
      `${String(i + 1).padEnd(3)} ${p.nombre.padEnd(14)} ${String(p.cantidad).padEnd(5)} ${formatearS(
        p.precio
      ).padEnd(8)} ${formatearS(subtotal)}`
    );
  });
}

/**
 * Calcula subtotal, descuento por tramos, IGV (18%) y total final.
 * Reglas de descuento:
 *  - >100 => 15%
 *  - >=50 => 10%
 *  - >=20 => 5%
 * @returns {{subtotal:number, descuento:number, igv:number, total:number}}
 */
function calcularTotales() {
  const subtotal = carrito.reduce((s, p) => s + p.precio * p.cantidad, 0);
  let descuento = 0;
  if (subtotal > 100) descuento = subtotal * 0.15;
  else if (subtotal >= 50) descuento = subtotal * 0.1;
  else if (subtotal >= 20) descuento = subtotal * 0.05;

  const igv = (subtotal - descuento) * 0.18;
  const total = subtotal - descuento + igv;
  return { subtotal, descuento, igv, total };
}

/**
 * Genera y muestra el ticket formateado.
 */
function generarTicket() {
  if (carrito.length === 0) {
    console.log(chalk.red("No hay productos en el carrito."));
    return;
  }

  const { subtotal, descuento, igv, total } = calcularTotales();

  console.log(chalk.blue("\n====== RESUMEN DE COMPRA ======"));
  console.log("Producto       Cant  Precio    Subtotal");
  console.log("---------------------------------------");
  carrito.forEach((p) => {
    const sub = p.precio * p.cantidad;
    console.log(`${p.nombre.padEnd(14)} ${String(p.cantidad).padEnd(5)} ${formatearS(p.precio).padEnd(8)} ${formatearS(sub)}`);
  });
  console.log("---------------------------------------");
  console.log(chalk.yellow(`Subtotal: ${formatearS(subtotal)}`));
  console.log(chalk.yellow(`Descuento: ${formatearS(descuento)}`));
  console.log(chalk.yellow(`IGV (18%): ${formatearS(igv)}`));
  console.log(chalk.green(`TOTAL: ${formatearS(total)}`));
  console.log(chalk.green("Gracias por su compra!"));
}

/**
 * Reportes varios: top precios, top vendidos (segun carrito), resumen
 */
function reportes() {
  console.log(chalk.magenta("\n=== REPORTES ==="));

  const top3 = [...productos].sort((a, b) => b.precio - a.precio).slice(0, 3);
  console.log(chalk.yellow("\nTop 3 productos mas caros:"));
  top3.forEach((p) => console.log(`- ${p.nombre} (${formatearS(p.precio)})`));

  const vendidos = [...carrito].sort((a, b) => b.cantidad - a.cantidad);
  if (vendidos.length > 0) {
    console.log(chalk.yellow("\nMas vendidos (segun carrito actual):"));
    vendidos.forEach((p) => console.log(`- ${p.nombre}: ${p.cantidad} unidades`));
  } else {
    console.log(chalk.yellow("\nNo hay ventas en el carrito para generar 'mas vendidos'."));
  }

  const totalItems = carrito.reduce((s, p) => s + p.cantidad, 0);
  const monto = carrito.reduce((s, p) => s + p.precio * p.cantidad, 0);
  console.log(chalk.yellow(`\nResumen carrito: ${totalItems} items, ${formatearS(monto)}`));
}

/* ==========================
   Listados y filtros
   ========================== */

/**
 * Lista todos los productos con formato.
 */
function listarProductos() {
  console.log(chalk.cyan("\n--- LISTA DE PRODUCTOS ---"));
  console.log("ID  Producto       Categoria    Precio");
  console.log("---------------------------------------");
  productos.forEach((p) => {
    console.log(`${String(p.id).padEnd(3)} ${p.nombre.padEnd(14)} ${p.categoria.padEnd(12)} ${formatearS(p.precio)}`);
  });
}

/**
 * Lista productos filtrando por categoria
 * @param {string} categoria
 */
function listarPorCategoria(categoria) {
  const cat = String(categoria).trim().toLowerCase();
  const resultado = productos.filter((p) => p.categoria.toLowerCase() === cat);
  if (resultado.length === 0) {
    console.log(chalk.yellow("No se encontraron productos en esa categoria."));
    return;
  }
  console.log(chalk.cyan(`\nProductos en categoria: ${cat}`));
  resultado.forEach((p) => {
    console.log(`- ${p.nombre} (${formatearS(p.precio)})`);
  });
}

/* ==========================
   Interaccion: menu principal
   ========================== */

function mostrarMenu() {
  console.log(`
===== MENU PRINCIPAL =====
1. Registrar venta
2. Listar productos
3. Buscar producto
4. Ver carrito
5. Vaciar carrito
6. Generar ticket
7. Reportes
8. Listar por categoria
9. Salir
`);
}

/**
 * Flujo asincrono del menu para usar await con preguntas
 */
async function menu() {
  mostrarMenu();
  const op = String(await preguntar("Seleccione una opcion: ")).trim();

  switch (op) {
    case "1": {
      const p = await preguntar("Ingrese nombre o ID del producto: ");
      const c = await preguntar("Cantidad: ");
      agregarAlCarrito(p, Number(c));
      break;
    }
    case "2":
      listarProductos();
      break;
    case "3": {
      const p = await preguntar("Ingrese nombre o ID del producto: ");
      const encontrado = buscarProducto(p);
      if (encontrado)
        console.log(`Producto: ${encontrado.nombre}, Precio: ${formatearS(encontrado.precio)}, Categoria: ${encontrado.categoria}`);
      else console.log(chalk.red("Producto no encontrado."));
      break;
    }
    case "4":
      verCarrito();
      {
        const resp = String(await preguntar("Desea eliminar un producto? (s/n): ")).trim().toLowerCase();
        if (resp === "s") {
          const val = await preguntar("Ingrese nombre o ID del producto a eliminar: ");
          eliminarDelCarrito(val);
        }
      }
      break;
    case "5": {
      const resp = String(await preguntar("Desea vaciar el carrito? (s/n): ")).trim().toLowerCase();
      if (resp === "s") vaciarCarrito();
      break;
    }
    case "6":
      generarTicket();
      break;
    case "7":
      reportes();
      break;
    case "8": {
      const cat = await preguntar("Ingrese categoria: ");
      listarPorCategoria(cat);
      break;
    }
    case "9":
      console.log("Hasta luego!");
      rl.close();
      return;
    default:
      console.log(chalk.red("Opcion no valida, por favor intente nuevamente."));
  }

  // Volver al menu principal
  await menu();
}

/* ==========================
   Iniciar aplicacion
   ========================== */
console.log(chalk.green("Bienvenido al sistema Delicia"));
menu();
