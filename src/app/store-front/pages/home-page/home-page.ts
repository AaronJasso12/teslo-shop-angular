import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { ProductCard } from '@products/components/product-card/product-card';
import { ProductService } from '@products/services/product-service';
import { Pagination } from '@shared/components/pagination/pagination';
import { PaginationService } from '@shared/components/pagination/pagination-service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCard, Pagination],
  templateUrl: './home-page.html',
})
export class HomePage {
  productsSrv = inject(ProductService);
  paginationSrv = inject(PaginationService);

  // route = inject(ActivatedRoute);

  // currentpage = toSignal(
  //   this.route.queryParamMap.pipe(
  //     map(params => (params.get('page') ? +params.get('page')! : 1 )),
  //     map(page => (isNaN(page) ? 1 : page ))
  //   ),
  //   {
  //     initialValue: 1,
  //   }
  // );

  productsResorce = rxResource({
    params: () => ({ page: this.paginationSrv.currentpage() - 1 }),
    stream: ({ params }) => {

      return this.productsSrv.getProducts({
        offset: params.page * 9
      });
    }
  });
}
