import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/product';
import { MatCard, MatCardModule } from '@angular/material/card';
import { ProductItemComponent } from "./product-item/product-item.component";
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { ShopParams } from '../../shared/models/shopParams';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { Pagination } from '../../shared/models/pagination';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    MatCard,
    ProductItemComponent,
    MatButton,
    MatIcon,
    MatMenu,
    MatListOption,
    MatListOption,
    MatMenuTrigger,
    MatSelectionList,
    FormsModule,
    MatPaginator
],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {

  private service = inject(ShopService);
  private dialogService = inject(MatDialog);
  products?: Pagination<Product>;

  sortOptions = [
    { value: 'Alphabetical', viewValue: 'name' },
    { value: 'Price Low-High', viewValue: 'priceAsc' },
    { value: 'Price High-Low', viewValue: 'priceDesc' },
  ]

  shopParams = new ShopParams();

 ngOnInit(): void {
    this.initializeShop();
    
  }

  
  onPageChanged(event: PageEvent) {
    if (this.shopParams.pageIndex !== event.pageIndex || this.shopParams.pageSize !== event.pageSize) {
      this.shopParams.pageIndex = event.pageIndex;
      this.shopParams.pageSize = event.pageSize;
      this.getProducts();
    }
  }

  onSortChange(event: MatSelectionListChange) {
    const selected = event.options[0];
    if (selected) {
      this.shopParams.sort = selected.value;
      this.getProducts();
    }
  }

  initializeShop(): void {
    this.service.getBrands();
    this.service.getTypes();
    this.getProducts();
  }

     getProducts(){
     this.service.getProducts(this.shopParams).subscribe({
        next: response => {
          // console.log('Sorted products:', response.data);
          this.products = response;
        },
        error: err => console.error('Error fetching sorted products:', err)
      });
   }

  openFiltersDialog(): void {
    const dialogRef = this.dialogService.open(FiltersDialogComponent, {
      minWidth: '550px',
      data: {
        brands: this.service.brands,
        types: this.service.types,
        selectedBrands: this.shopParams.brands,
        selectedType: this.shopParams.types
      }
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          console.log('Dialog closed with result:', result);
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedType;
          this.getProducts();
        }
      },
      error: (err) => console.error('Dialog closed with error:', err) 
    })
  }

}
