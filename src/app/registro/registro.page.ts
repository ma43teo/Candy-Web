import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  nombre: string = '';
  apellido: string = '';
  telefono: string = '';
  email: string = '';
  contrasena: string = '';
  codigoVerificacion: string = '';

  recaptchaVerifier?: firebase.auth.RecaptchaVerifier;
  confirmationResult?: firebase.auth.ConfirmationResult;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container', // ID del elemento HTML del recaptcha
      {
        size: 'normal',
        callback: (response: any) => {
          // Recaptcha verificado correctamente
        },
        'expired-callback': () => {
          // Recaptcha expirado
        },
      }
    );
    this.recaptchaVerifier.render();
  }

  irALogin() {
    this.router.navigate(['/login'], {
      state: { telefono: this.telefono, contrasena: this.contrasena },
    });
  }

  enviarCodigoVerificacion() {
    const phoneNumber = '+52' + this.telefono; // código de país correspondiente
    if (this.recaptchaVerifier) {
      firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, this.recaptchaVerifier)
        .then((confirmationResult) => {
          // El código de verificación se ha enviado correctamente
          this.confirmationResult = confirmationResult;
        })
        .catch((error) => {
          // Ocurrió un error al enviar el código de verificación
          console.error('Error al enviar el código de verificación:', error);
        });
    } else {
      console.error('El objeto recaptchaVerifier es undefined');
    }
  }

  guardar() {
    const verificationCode = this.codigoVerificacion; // Obtén el código de verificación ingresado por el usuario
    const credential = this.confirmationResult?.verificationId
      ? firebase.auth.PhoneAuthProvider.credential(
          this.confirmationResult.verificationId,
          verificationCode
        )
      : null;

    if (!credential) {
      console.error('No se pudo obtener la credencial de verificación');
      return;
    }

    this.afAuth
      .createUserWithEmailAndPassword(this.email, this.contrasena)
      .then((userCredential) => {
        const { user } = userCredential;

        if (user) {
          user.updatePhoneNumber(credential)
            .then(() => {
              // Guardar datos adicionales en Firestore
              return this.firestore.collection('usuarios').doc(user.uid).set({
                nombre: this.nombre,
                apellido: this.apellido,
                telefono: this.telefono,
                correo: this.email,
              });
            })
            .then(() => {
              console.log('Usuario registrado y datos guardados exitosamente');
              this.router.navigate(['/home']);
            })
            .catch((error: any) => {
              console.error('Error al actualizar el número de teléfono:', error);
            });
        } else {
          throw new Error('El usuario no está disponible');
        }
      })
      .catch((error: any) => {
        console.error('Error al registrar usuario y guardar los datos:', error);
      });
  }
  
}
