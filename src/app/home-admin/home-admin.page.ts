import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NuevoProductoModalPage } from '../nuevo-producto-modal/nuevo-producto-modal.page';
import { EditarPrecioModalPage } from '../editar-precio-modal/editar-precio-modal.page';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { DetalleProductoModalPage } from '../detalle-producto-modal/detalle-producto-modal.page';
import {  AlertController } from '@ionic/angular';
import { Router } from '@angular/router';






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
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss']
})
export class HomeAdminPage implements OnInit {
  categorias: string[] = [];
  categoriaSeleccionada: string = 'categorias';
  productosCollection!: AngularFirestoreCollection<Producto>;
  productos$!: Observable<Producto[]>;
  productos!: Producto[];
   // Propiedad para almacenar los productos

  imagenNoDisponible(event: any) {
    // Lógica para manejar el caso de imagen no disponible
    event.target.src = 'ruta-de-la-imagen-por-defecto';
  }


  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) {}

  async openModal() {
    const modal = await this.modalController.create({
      component: NuevoProductoModalPage,
      cssClass: 'my-custom-modal'
    });

    return await modal.present();
  }


  ngOnInit() {
    this.productosCollection = this.firestore.collection<Producto>('productos');
    this.productos$ = this.productosCollection.valueChanges();
    this.productos$.subscribe(productos => {
      this.productos = productos; // Asignar productos a la propiedad
      console.log(this.productos); // Verifica que los productos se hayan asignado correctamente

      this.productos.forEach(producto => {
        if (!this.categorias.includes(producto.categoria)) {
          this.categorias.push(producto.categoria);
        }
      });
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
  async editarProducto(producto: Producto) {
    const modal = await this.modalController.create({
      component: EditarPrecioModalPage,
      componentProps: {
        producto: producto
      }
    });
  
    modal.onDidDismiss().then(data => {
      if (data && data.data && data.data.success) {
        // Actualiza la vista o realiza alguna acción después de guardar los cambios
        console.log('Cambios guardados con éxito');
      } else {
        // No se guardaron los cambios o se canceló la edición
        console.log('Edición cancelada');
      }
    });
  
    return await modal.present();
  }
  
  async eliminarProducto(nombre: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            // Realizar la eliminación del producto
            try {
              const productosRef = this.firestore.collection('productos', ref => ref.where('nombre', '==', nombre));
              const productosSnapshot = await productosRef.get().toPromise();
              if (productosSnapshot && !productosSnapshot.empty) {
                // Obtener el ID del primer documento coincidente
                const productoId = productosSnapshot.docs[0].id;
                await this.firestore.collection('productos').doc(productoId).delete();
                // Mostrar mensaje de éxito
                const toast = await this.toastController.create({
                  message: 'Producto eliminado correctamente',
                  duration: 2000,
                  position: 'bottom'
                });
                toast.present();
              } else {
                console.error('No se encontró ningún producto con el nombre especificado');
              }
            } catch (error) {
              // Manejar el error en caso de que la eliminación falle
              console.error('Error al eliminar el producto:', error);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async abrirModal() {
    const alert = await this.alertController.create({
      header: 'Seleccione el porcentaje de incremento',
      inputs: [
        {
          name: 'porcentaje',
          type: 'number',
          placeholder: 'Porcentaje permitido (5, 10, 15)'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            const porcentaje = parseInt(data.porcentaje, 10);
            if ([5, 10, 15].includes(porcentaje)) {
              this.incrementarPorcentaje(porcentaje);
            } else {
              this.mostrarMensaje('Ingrese un porcentaje válido (5, 10, 15)');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  incrementarPorcentaje(porcentaje: number) {
    this.productosCollection.ref.where('categoria', '==', this.categoriaSeleccionada)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const producto = doc.data() as Producto;
          const precioActualizado = producto.precio * (1 + (porcentaje / 100));
          const precioPorMayorActualizado = producto.precioPorMayor * (1 + (porcentaje / 100));

          this.productosCollection.doc(doc.id).update({
            precio: precioActualizado,
            precioPorMayor: precioPorMayorActualizado
          });
        });
      })
      .catch(error => {
        console.error('Error al incrementar el precio:', error);
      });
  }

  async mostrarMensaje(mensaje: string) {
    const alert = await this.alertController.create({
      message: mensaje,
      buttons: ['Aceptar']
    });

    await alert.present();
  }  
  aplicarIncremento(porcentaje: number) {
    this.productosCollection.ref.where('categoria', '==', this.categoriaSeleccionada)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const producto = doc.data() as Producto;
          const precioActualizado = producto.precio * (1 + (porcentaje / 100));
          const precioPorMayorActualizado = producto.precioPorMayor * (1 + (porcentaje / 100));
  
          this.productosCollection.doc(doc.id).update({
            precio: precioActualizado,
            precioPorMayor: precioPorMayorActualizado
          });
        });
      })
      .catch(error => {
        console.error('Error al incrementar el precio:', error);
      });
  }
}  