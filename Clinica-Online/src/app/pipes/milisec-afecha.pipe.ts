import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'milisecAFecha'
})
export class MilisecAFechaPipe implements PipeTransform {

  transform(milliseconds: number): string {
    const date = new Date(milliseconds);
    return date.toDateString();
  }

}
