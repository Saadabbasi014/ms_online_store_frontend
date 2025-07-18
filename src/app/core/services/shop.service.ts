import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination } from '../../shared/models/pagination';
import { Product } from '../../shared/models/product';
import { ShopParams } from '../../shared/models/shopParams';

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

  
  
  getProducts(shopParams: ShopParams) {

    let params = new HttpParams();

    if (shopParams.types && shopParams.types.length > 0) {
      params = params.append('types', shopParams.types.join(','));
    }

    if (shopParams && shopParams.brands.length > 0) {
      params = params.append('brands', shopParams.brands.join(','));
    }

    if (shopParams.sort) {
      params = params.append('sort', shopParams.sort);
    }

    params.append('pageSize', shopParams.pageSize);
    params = params.append('pageIndex', shopParams.pageIndex + 1);

    return this.http.get<Pagination<Product>>(this.baseUrl + 'product', { params });
  }

  getProduct(id: number){
    return this.http.get<any>(this.baseUrl + 'product/' + id )
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
