// domain/Cliente.js
/**
 * Clase Cliente
 * Representa un cliente sencillo con nombre y correo.
 * Por ahora solo se usa para extender funcionalidades futuras.
 */

class Cliente {
    constructor(nombre = "Invitado", correo = "") {
      this.nombre = nombre;
      this.correo = correo;
    }
    
    /** Devuelve una representación amigable del cliente */
    descripcion() {
      if (this.correo) {
        return `${this.nombre} (${this.correo})`;
      }
      return this.nombre;
    }
  }
  
  module.exports = Cliente;
  