import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';

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
  selector: 'app-editar-precio-modal',
  templateUrl: './editar-precio-modal.page.html',
  styleUrls: ['./editar-precio-modal.page.scss'],
})
export class EditarPrecioModalPage implements OnInit {
  producto!: Producto;
  nuevoNombre: string = '';
  nuevoPrecio: number = 0;
  nuevoPrecioPorMayor: number = 0;
  nuevaDescripcion: string = '';
  nuevaCategoria: string = '';
  nuevaImagen: string = '';

  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.producto) {
      this.nuevoNombre = this.producto.nombre;
      this.nuevoPrecio = this.producto.precio;
      this.nuevoPrecioPorMayor = this.producto.precioPorMayor;
      this.nuevaDescripcion = this.producto.descripcion;
      this.nuevaCategoria = this.producto.categoria;
      this.nuevaImagen = this.producto.imagen;
    }
  }

  guardarCambios() {
    // Realiza la consulta para buscar el documento por el nombre
    const query = this.firestore.collection('productos', ref => ref.where('nombre', '==', this.producto.nombre));
  
    // Ejecuta la consulta y obtén el primer resultado
    query.get().subscribe(snapshot => {
      if (snapshot.docs.length > 0) {
        const doc = snapshot.docs[0];
        const docId = doc.id;
  
        // Actualiza el documento con los nuevos valores
        this.firestore.collection('productos').doc(docId).update({
          nombre: this.nuevoNombre,
          precio: this.nuevoPrecio,
          precioPorMayor: this.nuevoPrecioPorMayor,
          descripcion: this.nuevaDescripcion,
          categoria: this.nuevaCategoria,
          imagen: this.nuevaImagen
          // Actualiza más campos según los que deseas editar
        }).then(() => {
          // Cierra el modal y muestra un mensaje de éxito
          this.modalController.dismiss({ success: true });
        }).catch(error => {
          console.error('Error al guardar cambios:', error);
          // Muestra un mensaje de error si la actualización falla
        });
      } else {
        console.error('No se encontró ningún documento con el nombre proporcionado');
      }
    });
  }
  

  cancelarEdicion() {
    this.modalController.dismiss({ success: false });
  }
}
