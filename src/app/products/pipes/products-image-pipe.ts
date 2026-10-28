import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@environment/environment';

const BASE_URL = environment.baseUrl;

@Pipe({
  name: 'productImage'
})

export class ProductImagePipe implements PipeTransform {
  transform(value: null | string | string[]): string {
    if (value === null) {
      return './assets/images/no-image.jpg';
    }

    if (typeof value === 'string' && value.startsWith('blob:')) {
      return value;
    }

    if (typeof value === 'string') {
      return `${BASE_URL}/files/product/${value}`;
    }

    const img = value.at(0);
    if (!img) {
      return './assets/images/no-image.jpg';
    }

    return `${BASE_URL}/files/product/${value[0]}`;
  }
}
