import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Order, OrderToCreate } from '../../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  baseUrl = environment.baseUrl;
  private http = inject(HttpClient);

  createOrder(orderToCreate: OrderToCreate){
    return this.http.post<Order>(this.baseUrl + 'orders', orderToCreate);
  }

  getOrderForUser(){
    return this.http.get<Order[]>(this.baseUrl + 'orders')
  }

  getOrderDetailed(id: number){
    return this.http.get<Order>(this.baseUrl + 'orders/' + id)
  }
}
