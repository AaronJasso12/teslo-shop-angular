import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interfaces';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from '@environment/environment';
import { User } from '@auth/interfaces/user.interface';

const BASE_URL = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User
}

@Service()
export class ProductService {
  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse>{
    const { limit = 9, offset = 0, gender = ''} = options;

    const key = `${limit}-${offset}-${gender}`;
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http.get<ProductsResponse>(`${BASE_URL}/products`, {
      params: {
        limit,
        offset,
        gender,
      }
    })
    .pipe(
      tap(resp => console.log(resp)),
      tap((resp) => this.productsCache.set(key, resp))
    );
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    if (this.productCache.has(idSlug)) {
      return of(this.productCache.get(idSlug)!);
    }

    return this.http.get<Product>(`${BASE_URL}/products/${idSlug}`)
    .pipe(
      tap((pproduct) => this.productCache.set(idSlug, pproduct))
    );
  }

  getProductById(id: string): Observable<Product> {
    if (id === 'new') {
      return of(emptyProduct);
    }

    if (this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }

    return this.http.get<Product>(`${BASE_URL}/products/${id}`)
    .pipe(
      tap((pproduct) => this.productCache.set(id, pproduct))
    );
  }

  updateProduct(id: string, productLike: Partial<Product>, imageFileList?: FileList) :Observable<Product>{
    const currentImages = productLike.images ?? [];

    return this.uploadImages(imageFileList)
      .pipe(
        map(imageNames => ({
          ...productLike,
          images: [...currentImages, ...imageNames]
        })),
        switchMap((updateProduct) =>
          this.http.patch<Product>(`${BASE_URL}/products/${id}`, updateProduct)
        ),
        tap((product) => this.updateProductCache(product))
      );

    // return this.http.patch<Product>(`${BASE_URL}/products/${id}`, productLike)
    // .pipe(tap((product) => this.updateProductCache(product)));
  }

  createProdutc(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {
    return this.uploadImages(imageFileList)
    .pipe(
      map(imagesNames => ({
        ...productLike,
        images: imagesNames
      })),
      switchMap((updateProduct) => this.http.post<Product>(`${BASE_URL}/products`, updateProduct)),
      tap((product) => this.updateProductCache(product))
    );

    // return this.http.post<Product>(`${BASE_URL}/products`, productLike)
    // .pipe(tap((product) => this.updateProductCache(product)));
  }

  updateProductCache(product: Product) {
    const productId = product.id;

    this.productCache.set(productId, product);

    this.productsCache.forEach(productResponse => {
      productResponse.products = productResponse.products.map((currentProduct) => {
        return currentProduct.id === productId ? product : currentProduct;
      });
    });

    console.log('Cache actualziado');
  }

  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);

    const uploadObservables = Array.from(images).map(imageFile => this.uploadImage(imageFile));

    return forkJoin(uploadObservables).pipe(
      tap((imageNames) => console.log({imageNames}))
    );
  }

  uploadImage (imgFile: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', imgFile);

    return this.http.post<{fileName: string}>(`${BASE_URL}/files/product`, formData)
    .pipe(map((resp) => resp.fileName));
  }
}
