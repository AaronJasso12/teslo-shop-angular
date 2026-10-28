import { SlicePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/product.interfaces';
import { ProductImagePipe } from '@products/pipes/products-image-pipe';

@Component({
  selector: 'product-card',
  imports: [RouterLink,SlicePipe, ProductImagePipe],
  templateUrl: './product-card.html',
})
export class ProductCard {
  product = input.required<Product>();

  // imgUrl = computed(() => {
  //   return `http://localhost:3000/api/files/product/${this.product().images[0]}`;
  // })
}
