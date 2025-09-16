import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5115/notificationHub') 
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  addOrderUpdateListener(callback: (orderId: string, status: string) => void): void {
    this.hubConnection.on('ReceiveOrderUpdate', (orderId, status) => {
      callback(orderId, status);
    });
  }

  addMessageListener(callback: (user: string, message: string) => void): void {
    this.hubConnection.on('ReceiveMessage', (user, message) => {
      callback(user, message);
    });
  }

  sendMessage(user: string, message: string): void {
    this.hubConnection.invoke('SendMessage', user, message)
      .catch(err => console.error(err));
  }

  addNotificationListener(callback: (message: string) => void): void {
  this.hubConnection.on('ReceiveNotification', (message: string) => {
    alert(message);
    callback(message);
  });
}

}
