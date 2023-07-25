import { Injectable } from '@angular/core';
import { Producto } from './producto.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
    providedIn: 'root'
  })
  export class CarritoService {
    carrito: Producto[] = [];
    fechaRecoleccion: Date | null = null; // Tipo de dato Date, inicializado a null
    totalCompra: number = 0;
    
  
    constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) { }
  
    agregarProducto(producto: Producto) {
      const productoEnCarrito = this.carrito.find((item) => item.nombre === producto.nombre);
      if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
      } else {
        this.carrito.push({ ...producto, cantidad: 1 });
      }
      // Do not decrement the original product's quantity here
    }
  
    getCarrito(): Producto[] {
      return this.carrito; // Returns a reference to the original carrito array
    }
  
    vaciarCarrito() {
      this.carrito = []; // Empty the carrito
    }
    
    guardarCarritoEnFirestore() {
      const user = firebase.auth().currentUser;
      if (user) {
        const email = user.email;
        if (email) {
          const carritoRef = this.firestore.collection('carrito').doc(email); // Use email as the document ID
          const carritoId = uuidv4(); // Generate a unique identifier for each order
          carritoRef.collection('orders').doc(carritoId) // Use collection 'orders' to store the user's order history
            .set({
              productos: this.carrito,
              fechaRecoleccion: this.fechaRecoleccion,
              totalCompra: this.totalCompra
            })
            .then(() => {
              console.log('Carrito guardado en Firestore');
            })
            .catch((error) => {
              console.error('Error al guardar el carrito en Firestore:', error);
            });
        } else {
          console.error('El usuario no tiene un correo electrónico.');
        }
      } else {
        console.error('No se pudo obtener el usuario actual.');
      }
    }
      // Agrega estos métodos para establecer las fechas en el servicio
  setFechaRecoleccion(fecha: Date) {
    this.fechaRecoleccion = fecha;
  }


    
    removeProducto(producto: Producto) {
      // Encontrar el índice del producto en el carrito
      const index = this.carrito.findIndex((p) => p.nombre === producto.nombre);
  
      // Si el producto está en el carrito, eliminarlo
      if (index !== -1) {
        this.carrito.splice(index, 1);
    }
   }
}
  


  
  