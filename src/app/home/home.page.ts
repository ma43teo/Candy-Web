import { Component, OnInit } from '@angular/core';
import Swiper, { Navigation } from 'swiper';
import { ModalController, NavController} from '@ionic/angular';
import { NuevoProductoModalPage } from '../nuevo-producto-modal/nuevo-producto-modal.page';
import { EditarPrecioModalPage } from '../editar-precio-modal/editar-precio-modal.page';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { DetalleProductoModalPage } from '../detalle-producto-modal/detalle-producto-modal.page';
import { CarritoService } from '../carrito.service';
import { Router } from '@angular/router'




interface Producto {
  id: string;
  nombre: string;
  precio: number;
  precioPorMayor: number;
  descripcion: string;
  categoria: string;
  imagen: string;
  cantidad: number;
  mostrarDetalle: boolean;
  fechaRecoleccion: Date; 
  horaRecoleccion: Date;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  categoriaSeleccionada: string = 'categorias';
  productosCollection!: AngularFirestoreCollection<Producto>;
  productos$!: Observable<Producto[]>;
  productos!: Producto[]; // Propiedad para almacenar los productos
  carrito: Producto[] = [];
  imagenNoDisponible(event: any) {
    // Lógica para manejar el caso de imagen no disponible
    event.target.src = 'ruta-de-la-imagen-por-defecto';
  }
  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private navCtrl: NavController,
    private carritoService: CarritoService,
    private router:Router

  ) {}
  async openModal() {
    const modal = await this.modalController.create({
      component: NuevoProductoModalPage,
      cssClass: 'my-custom-modal'
    });
  
    return await modal.present();
  }
  async abrirModal() {
    const modal = await this.modalController.create({
      component: EditarPrecioModalPage,
      cssClass: 'my-custom-modal' 
    });
  
    return await modal.present();
}
  
  
ofertas(){
  this.router.navigate(['/ofertas']); 
}
 
  ngOnInit() {
    Swiper.use([Navigation]);
    this.initSwiper();
    this.productosCollection = this.firestore.collection<Producto>('productos');
    this.productos$ = this.productosCollection.valueChanges();
    this.productos$.subscribe(productos => {
      this.productos = productos; // Asignar productos a la propiedad
      console.log(this.productos); // Verifica que los productos se hayan asignado correctamente
    });
  }



  async agregarAlCarrito(producto: Producto) {
    this.carritoService.agregarProducto(producto);
  
    if (producto.cantidad > 0) {
      const index = this.carrito.findIndex((item) => item.nombre === producto.nombre);
  
      if (index !== -1) {
        this.carrito[index].cantidad++;
      } else {
        this.carrito.push({ ...producto, cantidad: 1 });
      }
  
      producto.cantidad--; // Move the decrement inside the condition
  
      // Update the counter in the button
      const contadorButton = document.getElementById(`contador-${producto.nombre}`);
      if (contadorButton) {
        contadorButton.innerHTML = producto.cantidad.toString();
      }
  
      // Show a toast message
      const toast = await this.toastController.create({
        message: 'Producto agregado al carrito',
        duration: 2000,
        position: 'bottom',
      });
      toast.present();
    }
  }
  

 // Función para obtener el total de productos en el carrito
 getTotalProductosEnCarrito(): number {
  return this.carritoService.getCarrito().reduce((total, producto) => total + producto.cantidad, 0);
}

// Función para vaciar el carrito
vaciarCarrito() {
  this.carritoService.vaciarCarrito();
}





  async mostrarDetalle(producto: any) {
    const modal = await this.modalController.create({
      component: DetalleProductoModalPage,
      componentProps: {
        producto: producto
      }
    });
    return await modal.present();
  }
  goToCart() {
    this.navCtrl.navigateForward('/cart');
  }
  
  private initSwiper() {
    setTimeout(() => {
      const swiper = new Swiper('.swiper-container', {
        direction: 'horizontal',
        slidesPerView: 'auto',
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        autoplay: {
          delay: 3000,
        },
      });

      swiper.on('init', () => {
        console.log('Swiper initialized');
      });

      swiper.on('slideChange', () => {
        console.log('Slide changed');
      });

      swiper.on('click', () => {
        console.log('Navigation button clicked');
      });
},0);
}
}