import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductService } from '@products/services/product-service';
import { PaginationService } from '@shared/components/pagination/pagination-service';
import { Pagination } from '@shared/components/pagination/pagination';

import { ProductTable } from '@products/components/product-table/product-table';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, Pagination, RouterLink],
  templateUrl: './products-admin-page.html',
})
export class ProductsAdminPage {
  productSrv = inject(ProductService);
  paginationSrv = inject(PaginationService);
  productsPerPage = signal(10);

  productsResource = rxResource({
    params: () => ({
      page: this.paginationSrv.currentpage() - 1,
      limit: this.productsPerPage(),
    }),
    stream: ({ params }) => {
      return this.productSrv.getProducts({
        offset: params.page * 9,
        limit: params.limit,
      });
    }
  });
}
