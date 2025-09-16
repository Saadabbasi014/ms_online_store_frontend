import { Component, effect, inject, OnInit } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BusyService } from '../../core/services/busy.service';
import { CartService } from '../../core/services/cart.service';
import { AccountService } from '../../core/services/account.service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { SignalRService } from '../../core/services/signalr.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIcon,
    MatButton,
    MatBadge,
    RouterLink,
    RouterLinkActive,
    MatProgressBar,
    MatMenu,
    MatMenuTrigger,
    MatDivider,
    MatMenuItem,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit  {
  busyService = inject(BusyService);
  cartService = inject(CartService);
  accountService = inject(AccountService);
  private router = inject(Router);
  private signalRService = inject(SignalRService);

    notifications: string[] = [];
  unreadCount = 0;

  constructor() {
        effect(() => {
      const user = this.accountService.currentUser();
      console.log('Current user:', user);
    });
  }

   ngOnInit(): void {
    this.signalRService.startConnection();

    this.signalRService.addNotificationListener((message) => {
      this.notifications.unshift(message);
      this.unreadCount++;
    });
  }

  clearNotifications() {
    this.unreadCount = 0;
  }

  logOut() {
    this.accountService.logOut();
    this.router.navigateByUrl('/');
  }
}
