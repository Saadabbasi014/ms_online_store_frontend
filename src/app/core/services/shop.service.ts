import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination } from '../../shared/models/pagination';
import { Product } from '../../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor() { }

  baseUrl = 'http://localhost:5115/api/';
  private http = inject(HttpClient);

  products : Product[] = [];
  types  : string[] = [];
  brands : string[] = [];

  
  
  getProducts(brands?: string[], types?: string[], sort?: string) {

    let params = new HttpParams();

    if (types && types.length > 0) {
      params = params.append('types', types.join(','));
    }

    if (brands && brands.length > 0) {
      params = params.append('brands', brands.join(','));
    }

    if (sort) {
      params = params.append('sort', sort);
    }

    params.append('pagesize', 20);
    return this.http.get<Pagination<Product>>(this.baseUrl + 'product', { params });
  }

  getBrands() {
    this.http.get<string[]>(this.baseUrl + 'productV2/brands')
      .subscribe((response: string[]) => {
        this.brands = response;
        // console.log('Brands fetched:', response);
      });
  }

  getTypes() {
    this.http.get<string[]>(this.baseUrl + 'productV2/types')
      .subscribe((response: string[]) => this.types = response);
  }
}
