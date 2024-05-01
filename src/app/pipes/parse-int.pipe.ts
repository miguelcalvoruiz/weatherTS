import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseInt'
})
export class ParseIntPipe implements PipeTransform {
  transform(value: any): number {
    return parseInt(value, 10);
  }
}
