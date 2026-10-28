import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { ProductService } from '@products/services/product-service';
import { ProductCard } from '@products/components/product-card/product-card';
import { Pagination } from '@shared/components/pagination/pagination';
import { PaginationService } from '@shared/components/pagination/pagination-service';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard, Pagination],
  templateUrl: './gender-page.html',
})
export class GenderPage {
  private route = inject(ActivatedRoute);
  private productsSrv = inject(ProductService);
  paginationSrv = inject(PaginationService);

  gender = toSignal(this.route.params.pipe(map(({ gender }) => gender)));

  productsResource = rxResource({
    params: () => (
      {
        gender: this.gender(),
        page: this.paginationSrv.currentpage() - 1
      }
    ),
    stream: ({ params }) => {
      return this.productsSrv.getProducts(
        {
          gender: params.gender,
          offset: params.page * 9,
        }
      );
    }
  });
}
