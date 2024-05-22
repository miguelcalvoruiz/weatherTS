import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirstWord'
})
export class CapitalizeFirstWordPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const words = value.split(' ');
    if (words.length > 1) {
      return words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase() + ' ' + words.slice(1).join(' ');
    } else {
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
  }
}
