import { Component, OnInit } from '@angular/core';
import Swiper, { Navigation } from 'swiper';
import { ModalController } from '@ionic/angular';
import { NuevoProductoModalPage } from '../nuevo-producto-modal/nuevo-producto-modal.page';
import { EditarPrecioModalPage } from '../editar-precio-modal/editar-precio-modal.page';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { DetalleProductoModalPage } from '../detalle-producto-modal/detalle-producto-modal.page';




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

  imagenNoDisponible(event: any) {
    // Lógica para manejar el caso de imagen no disponible
    event.target.src = 'ruta-de-la-imagen-por-defecto';
  }
  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private toastController: ToastController
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
  async agregarAlCarrito(producto: any) {
    if (producto.cantidad > 0) {
      // Restar la cantidad del producto
      producto.cantidad--;

      // Actualizar el contador en el botón
      const contadorButton = document.getElementById(`contador-${producto.id}`);
      if (contadorButton) {
        contadorButton.innerHTML = producto.cantidad.toString();
      }

      // Mostrar un mensaje emergente
      const toast = await this.toastController.create({
        message: 'Producto agregado al carrito',
        duration: 2000,
        position: 'bottom',
      });
      toast.present();
    }
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