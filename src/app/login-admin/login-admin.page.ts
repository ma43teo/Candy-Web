import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';



@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.page.html',
  styleUrls: ['./login-admin.page.scss'],
})
export class LoginAdminPage {
  email: string = '';
  contrasena: string = '';

  constructor(private router: Router,private afAuth: AngularFireAuth) { }

  irALogin() {
    this.router.navigate(['/login']);
  }

  iniciarSesion() {
    // Verificar las credenciales de administrador
    if (this.email === 'solucionesgap1@gmail.com' && this.contrasena === 'DulceriaEstrella') {
      // Autenticar al administrador con Firebase Authentication
      this.afAuth.signInWithEmailAndPassword(this.email, this.contrasena)
        .then(() => {
          // Autenticación exitosa
          console.log('Administrador autenticado correctamente');
  
          // Redirigir a la página de administrador
          this.router.navigate(['/home-admin']);
        })
        .catch((error) => {
          // Error de autenticación
          console.error('Error al autenticar al administrador', error);
        });
    } else {
      console.log('Credenciales inválidas');
    }
  }
}