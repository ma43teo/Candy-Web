// carrito.page.ts
import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../carrito.service';
import { Producto } from '../producto.model';
import { v4 as uuidv4 } from 'uuid';
import { ModalController } from '@ionic/angular';
import { PedidoConfirmadoModalPage } from '../pedido-confirmado-modal/pedido-confirmado-modal.page'; // Import PedidoConfirmadoModalPage

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  carrito: Producto[] = [];
  productosAgrupados: { [key: string]: Producto[] } = {};
  total: number = 0;

  constructor(private carritoService: CarritoService, private modalController: ModalController) {}


  ngOnInit() {
    this.carrito = this.carritoService.getCarrito();
    this.productosAgrupados = this.groupByNombre(this.carrito);
    this.calculateTotal();
    this.carritoService.setFechaRecoleccion(new Date()); // Establecer fechaRecoleccion a la fecha actual
  }

  fechaRecoleccion: Date | null = null;

  setFechaRecoleccion(eventValue: string) {
    // Analizar el valor de cadena a un objeto de fecha
    const fecha = new Date(eventValue);
    this.carritoService.setFechaRecoleccion(fecha);
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

  async realizarPedido() {
    if (this.carritoService.fechaRecoleccion) {
      const diaCarritoId = 'some-unique-id'; 
      const semanaCarritoId = 'some-unique-id'; 
      const mesCarritoId = 'some-unique-id'; 
      this.carritoService.guardarCarritoEnFirestore(diaCarritoId, semanaCarritoId, mesCarritoId);

      // Agregar la llamada a guardarPedidoEnPedidos()
      this.carritoService.guardarPedidoEnPedidos(diaCarritoId, semanaCarritoId, mesCarritoId);
      
         // Mostrar un modal de confirmación con los detalles del pedido
     const modal = await this.modalController.create({
    component: PedidoConfirmadoModalPage,
    componentProps: {
      productos: this.carritoService.getCarrito(),
      totalCompra: this.carritoService.totalCompra,
      fechaRecoleccion: this.carritoService.fechaRecoleccion, // Pass the fechaRecoleccion property
    },
  });
  
      // Descartar el modal y vaciar el carrito cuando esté cerrado
      modal.onDidDismiss().then(() => {
        this.carritoService.vaciarCarrito();
      });
  
      await modal.present();
    } else {
      console.error('Por favor, selecciona una fecha y hora de recolección válidas.');
    }
  }
}