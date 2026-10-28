import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@products/services/product-service';
import { map, of } from 'rxjs';
import { ProductsCarousel } from '@products/components/products-carousel/products-carousel';

@Component({
  selector: 'app-product-page',
  imports: [ProductsCarousel],
  templateUrl: './product-page.html',
})
export class ProductPage {
  private route = inject(ActivatedRoute);
  productSrv = inject(ProductService);

  productSlug = this.route.snapshot.params['idSlug'];

  productResource = rxResource({
    params: () => ({ idSlug: this.productSlug }),
    stream: ({ params }) => {
      // if (!params.idSlug) return of([]);
      return this.productSrv.getProductByIdSlug(params.idSlug);
    }
  });
}
