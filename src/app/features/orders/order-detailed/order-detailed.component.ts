import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../shared/models/order';
import { MatCard } from '@angular/material/card';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-order-detailed',
  standalone: true,
  imports: [
    MatCard,
    MatButton,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './order-detailed.component.html',
  styleUrl: './order-detailed.component.scss'
})
export class OrderDetailedComponent implements OnInit {

  private orderService = inject(OrderService);
  private activatedRoute = inject(ActivatedRoute);
  order?: Order;

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.orderService.getOrderDetailed(+id).subscribe({
        next: order => this.order = order
      })
    }
  }
}
