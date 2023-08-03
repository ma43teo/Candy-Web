// pedido-confirmado-modal.page.ts

import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Producto } from '../producto.model';

@Component({
  selector: 'app-pedido-confirmado-modal',
  templateUrl: './pedido-confirmado-modal.page.html',
  styleUrls: ['./pedido-confirmado-modal.page.scss']
})
export class PedidoConfirmadoModalPage {
  @Input() productos: Producto[] = [];
  @Input() fechaRecoleccion: Date | null = null;
  @Input() totalCompra: number = 0;

  constructor(private modalController: ModalController) {}

  dismissModal() {
    this.modalController.dismiss();
  }
}
