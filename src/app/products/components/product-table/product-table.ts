
import { Component, input } from '@angular/core';
import { Product } from '@products/interfaces/product.interfaces';
import { ProductImagePipe } from '@products/pipes/products-image-pipe';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'product-table',
  imports: [ProductImagePipe, RouterLink, CurrencyPipe],
  templateUrl: './product-table.html',
})
export class ProductTable {
  products = input.required<Product[]>();
}
