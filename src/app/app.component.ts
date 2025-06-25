import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  products: any[] = [];
  ngOnInit(): void {
    this.http.get(this.baseUrl + 'productV2').subscribe({
      next: response => this.products = response as any[],
      complete: () => {
        console.log('Request completed');
      },
      error: error => {
        console.error(error); 
      }
    });
  }
  baseUrl = 'http://localhost:5115/api/';
  private http = inject(HttpClient);
  title = 'Skinet';
  // constructor(private http : HttpClient) {}
}
