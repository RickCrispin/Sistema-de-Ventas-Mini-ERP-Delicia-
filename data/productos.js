// data/productos.js
/**
 * Catálogo de productos de la panadería-pastelería "Delicia".
 * Mantiene un arreglo de objetos simples con id, nombre, precio y categoría.
 * Estos datos son estáticos, simulando una base de datos en memoria.
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
    { id: 9, nombre: "croissant", precio: 3.0, categoria: "panaderia" },
    { id: 10, nombre: "yogurt", precio: 3.5, categoria: "lacteos" }
  ];
  
  module.exports = productos;
  