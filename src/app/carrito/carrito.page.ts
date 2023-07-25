// carrito.page.ts
import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../carrito.service';
import { Producto } from '../producto.model';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  carrito: Producto[] = [];
  productosAgrupados: { [key: string]: Producto[] } = {}; // Cambio el tipo de productosAgrupados
  total: number = 0;



  constructor(public carritoService: CarritoService) {}

  ngOnInit() {
    this.carrito = this.carritoService.getCarrito();
    this.productosAgrupados = this.groupByNombre(this.carrito);
    this.calculateTotal(); // Llamamos a la función para calcular el total al iniciar la página
  }

  confirmarRecoleccion() {
    console.log('Fecha de recolección:', this.carritoService.fechaRecoleccion);
  

    if (this.carritoService.fechaRecoleccion) {
      // Convertir las fechas seleccionadas a objetos Date (esto no es necesario ya que ya están almacenadas en Date)
      this.carritoService.guardarCarritoEnFirestore();
    } else {
      console.error('Por favor, selecciona una fecha y hora de recolección válidas.');
    }
  }


  private groupByNombre(productos: Producto[]): { [key: string]: Producto[] } {
    const groupedProducts: { [key: string]: Producto[] } = {};

    productos.forEach((producto) => {
      const nombre = producto.nombre;
      if (!groupedProducts[nombre]) {
        groupedProducts[nombre] = [];
      }
      groupedProducts[nombre].push({ ...producto });
    });

    return groupedProducts;
  }

  getProductKeys() {
    return Object.keys(this.productosAgrupados);
 }
 removeProduct(producto: Producto) {
  // Eliminar el producto del carrito y actualizar la lista de productos agrupados
  this.carritoService.removeProducto(producto);
  this.carrito = this.carritoService.getCarrito();
  this.productosAgrupados = this.groupByNombre(this.carrito);
  this.calculateTotal();
}
private calculateTotal() {
  this.total = 0;
  this.carrito.forEach((producto) => {
    this.total += producto.precio * producto.cantidad;
  });
  this.carritoService.totalCompra = this.total;
}

 realizarPedido() {
  // Aquí puede haber lógica adicional antes de guardar el carrito en Firestore
  this.carritoService.guardarCarritoEnFirestore();
}
}
