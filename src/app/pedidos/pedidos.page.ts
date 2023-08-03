// pedidos.page.ts
import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../pedidos.service';
import { Order } from '../order.model';
import { Router } from '@angular/router';
import { Platform, ModalController, AlertController } from '@ionic/angular';
import { DocumentReference } from '@angular/fire/firestore'; // Agrega esta línea
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {
  orders: Order[] = [];
  categoriaSeleccionada: string = 'categorias';

  constructor(
    private pedidosService: PedidosService,
    private router: Router,
    private platform: Platform,
    private alertController: AlertController,
    private modalController: ModalController,
    private firestore: AngularFirestore // Agrega AngularFirestore al constructor
  ) {}

  ngOnInit() {
    this.fetchAllOrders();
  }

  fetchAllOrders() {
    this.pedidosService.getAllOrders().subscribe((orders: Order[]) => {
      this.orders = orders;
    });
  }

  // Helper method to format the date
  formatFechaRecoleccion(timestamp: any): string {
    if (!timestamp) {
      return ''; // O cualquier valor por defecto o mensaje que desees mostrar
    }

    const date = timestamp.toDate(); // Convert Timestamp to Date object
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
    });
  }
  irAHomeAdmind() {
    this.router.navigate(['/home-admin']);
  }
  // Método para cambiar el estado de selección del pedido
  toggleOrderSelection(order: Order) {
    order.selected = !order.selected;
  }
}