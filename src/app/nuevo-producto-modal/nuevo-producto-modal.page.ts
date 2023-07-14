import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-nuevo-producto-modal',
  templateUrl: './nuevo-producto-modal.page.html',
  styleUrls: ['./nuevo-producto-modal.page.scss'],
})
export class NuevoProductoModalPage {
  imagen?: File;
  nombre?: string;
  precio?: number;
  precioPorMayor?: number;
  descripcion?: string;
  categoria?: string;
  cantidad?: number;

  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  closeModal() {
    this.modalController.dismiss();
  }

  guardarProducto() {
    const nuevoProducto: any = {
      nombre: this.nombre || '',
      precio: this.precio || 0,
      precioPorMayor: this.precioPorMayor || 0,
      descripcion: this.descripcion || '',
      categoria: this.categoria || '',
      cantidad: this.cantidad || 0
    };

    if (this.imagen) {
      const filePath = `imagenes/${this.imagen.name}`;
      console.log('FilePath:', filePath); // Verifica la ruta de archivo generada
      
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, this.imagen);      

      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            nuevoProducto.imagen = url;

            this.firestore.collection('productos').add(nuevoProducto)
              .then(() => {
                console.log('Nuevo producto guardado en Firestore');
                this.modalController.dismiss();
              })
              .catch((error) => {
                console.error('Error al guardar el nuevo producto:', error);
              });
          });
        })
      ).subscribe(
        null, 
        (error) => {
          console.error('Error durante la carga de la imagen:', error);
        },
        () => {
          console.log('Upload completo'); // Verifica si se completó la carga de la imagen correctamente
        }
      );
    } else {
      this.firestore.collection('productos').add(nuevoProducto)
        .then(() => {
          console.log('Nuevo producto guardado en Firestore');
          this.modalController.dismiss();
        })
        .catch((error) => {
          console.error('Error al guardar el nuevo producto:', error);
        });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.imagen = file;
    console.log('Imagen seleccionada:', this.imagen); // Verifica si la imagen se asigna correctamente
  }
}
