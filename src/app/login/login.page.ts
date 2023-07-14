import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  correo: string = '';
  contrasena: string = '';

  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  irALoginAdmin() {
    this.router.navigate(['/login-admin']);
  }

  Login() {
    const email = this.correo;
    const password = this.contrasena;

    this.afAuth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // El inicio de sesión con correo electrónico y contraseña fue exitoso
        const user = userCredential.user;
        // Aquí puedes redirigir al usuario a la página deseada
        this.router.navigate(['/home']);
      })
      .catch((error: any) => {
        // Ocurrió un error durante el inicio de sesión
        console.error('Error al iniciar sesión:', error);
      });
  }

  Volver() {
    this.router.navigate(['registro']);
  }

  Recuperar() {
    this.router.navigate(['recuperar']);
  }
}

