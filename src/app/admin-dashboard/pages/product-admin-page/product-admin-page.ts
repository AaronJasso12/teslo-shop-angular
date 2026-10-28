import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '@products/services/product-service';
import { map } from 'rxjs';
import { ProductDetails } from './product-details/product-details';

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetails],
  templateUrl: './product-admin-page.html',
})
export class ProductAdminPage {
  route = inject(ActivatedRoute);
  router = inject(Router);
  productSrv = inject(ProductService);

  productId = toSignal(
    this.route.params.pipe(map(params => params['id']))
  );

  productResource = rxResource({
    params: () => ({ id: this.productId() }),
    stream: ({ params }) => {
      return this.productSrv.getProductById(params.id)
    }
  });

  redirectEffect = effect(() => {
    if (this.productResource.error()) {
      this.router.navigate(['/admin/products']);
    }
  });

}
