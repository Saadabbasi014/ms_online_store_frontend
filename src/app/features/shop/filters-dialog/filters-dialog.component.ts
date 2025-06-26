import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../../core/services/shop.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule
  ],
  templateUrl: './filters-dialog.component.html',
  styleUrls: ['./filters-dialog.component.scss']
})
export class FiltersDialogComponent {
  shopService = inject(ShopService);
  dialogRef = inject(MatDialogRef<FiltersDialogComponent>);

  selectedBrands: string[] = [];
  selectedTypes: string[] = [];

  toggleSelection(item: string, type: 'brand' | 'type') {
    const list = type === 'brand' ? this.selectedBrands : this.selectedTypes;
    const index = list.indexOf(item);
    index > -1 ? list.splice(index, 1) : list.push(item);
  }

  applyFilters(): void {
    this.dialogRef.close({
      selectedBrands: this.selectedBrands,
      selectedType: this.selectedTypes
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
