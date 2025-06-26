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
    FormsModule
],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  private service = inject(ShopService);
  private dialogService = inject(MatDialog);
  products: Product[] = [];
  selectedBrands : string[] = [];
  selectedType : string[] = [];
  selectedSort = 'name';

  sortOptions = [
    { value: 'Alphabetical', viewValue: 'name' },
    { value: 'Price Low-High', viewValue: 'priceAsc' },
    { value: 'Price High-Low', viewValue: 'priceDesc' },
  ]

 ngOnInit(): void {
    this.initializeShop();
    
  }

  onSortChange(event: MatSelectionListChange) {
    const selected = event.options[0];
    console.log('Selected sort option:', selected);
    if (selected) {
      this.selectedSort = selected.value;
      this.getProducts();
    }
  }

  initializeShop(): void {
    this.service.getBrands();
    this.service.getTypes();
    this.getProducts();
  }

     getProducts(){
     this.service.getProducts(this.selectedBrands, this.selectedType, this.selectedSort).subscribe({
        next: response => {
          // console.log('Sorted products:', response.data);
          this.products = response.data;
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
        selectedBrands: this.selectedBrands,
        selectedType: this.selectedType
      }
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          console.log('Dialog closed with result:', result);
          this.selectedBrands = result.selectedBrands;
          this.selectedType = result.selectedType;
          this.getProducts();
        }
      },
      error: (err) => console.error('Dialog closed with error:', err) 
    })
  }

}
