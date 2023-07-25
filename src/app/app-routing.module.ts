import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ReportdayComponent } from './reportday/reportday.component';
import { ReportweekComponent } from './reportweek/reportweek.component';
import { ReportmonthComponent } from './reportmonth/reportmonth.component';


const routes: Routes = [
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: '',
    redirectTo: 'registro',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'login-admin',
    loadChildren: () => import('./login-admin/login-admin.module').then( m => m.LoginAdminPageModule)
  },
  {
    path: 'recuperar',
    loadChildren: () => import('./recuperar/recuperar.module').then( m => m.RecuperarPageModule)
  },
  {
    path: 'home-admin',
    loadChildren: () => import('./home-admin/home-admin.module').then( m => m.HomeAdminPageModule)
  },
  {
    path: 'nuevo-producto-modal',
    loadChildren: () => import('./nuevo-producto-modal/nuevo-producto-modal.module').then( m => m.NuevoProductoModalPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'editar-precio-modal',
    loadChildren: () => import('./editar-precio-modal/editar-precio-modal.module').then( m => m.EditarPrecioModalPageModule)
  },
  {
    path: 'detalle-producto-modal',
    loadChildren: () => import('./detalle-producto-modal/detalle-producto-modal.module').then( m => m.DetalleProductoModalPageModule)
  },
  {
    path: 'reportedia',
    component: ReportdayComponent
  },
  {
    path: 'reportesemana',
    component: ReportweekComponent
  },
  {
    path: 'reportemes',
    component: ReportmonthComponent
  },
  {
    path: 'ofertas',
    loadChildren: () => import('./ofertas/ofertas.module').then( m => m.OfertasPageModule)
  },
  {
    path: 'carrito',
    loadChildren: () => import('./carrito/carrito.module').then( m => m.CarritoPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  declarations: [
    // Otros componentes declarados anteriormente
    ReportdayComponent,
    ReportweekComponent,
    ReportmonthComponent
  ],
  exports: [RouterModule, ReportdayComponent,  ReportweekComponent,
    ReportmonthComponent]
  
})
export class AppRoutingModule { }
