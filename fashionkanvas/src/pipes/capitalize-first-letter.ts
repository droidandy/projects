import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'CapitalizeFirstLetter'
})

@Injectable()
export class CapitalizeFirstLetterPipe implements PipeTransform {
  transform(data: any, args?: any): any {
    if(data){
      return data.charAt(0).toUpperCase() + data.slice(1);
    }
    return data;

  }
}
