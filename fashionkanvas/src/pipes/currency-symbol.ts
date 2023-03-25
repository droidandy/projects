import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'CurrencySymbol'
})

@Injectable()
export class CurrencySymbolPipe implements PipeTransform {
  transform(data: any, args?: any): any {
    if(data=='usd'){
      return '$';
    }else if(data=='euro'){
      return '€';
    }

  }
}
