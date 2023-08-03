import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular'; // Import AlertController

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.page.html',
  styleUrls: ['./login-admin.page.scss'],
})
export class LoginAdminPage {
  email: string = '';
  contrasena: string = '';
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private alertController: AlertController // Inject AlertController
  ) {}

  irALogin() {
    this.router.navigate(['/login']);
  }

  async showEmptyFieldsAlert() {
    const alert = await this.alertController.create({
      header: 'Campos Vacíos',
      message: 'Por favor, complete todos los campos obligatorios.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async showInvalidCredentialsAlert() {
    const alert = await this.alertController.create({
      header: 'Credenciales Inválidas',
      message: 'El correo electrónico o la contraseña son incorrectos.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async iniciarSesion() {
    // Comprobar si los campos de correo electrónico y contraseña están llenos
    if (!this.email || !this.contrasena) {
      this.showEmptyFieldsAlert();
      return;
    }

    // Verificar las credenciales de administrador
    if (this.email === 'solucionesgap1@gmail.com' && this.contrasena === 'DulceriaEstrella') {
      // Autenticar al administrador con Firebase Authentication
      this.afAuth
        .signInWithEmailAndPassword(this.email, this.contrasena)
        .then(() => {
          // Autenticación exitosa
          console.log('Administrador autenticado correctamente');

          // Redirigir a la página de administrador
          this.router.navigate(['/home-admin']);
        })
        .catch((error) => {
          // Error de autenticación
          console.error('Error al autenticar al administrador', error);
          this.showInvalidCredentialsAlert();
        });
    } else {
      this.showInvalidCredentialsAlert();
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}