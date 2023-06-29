import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mayusNombres'
})
export class MayusNombresPipe implements PipeTransform {

  transform(value: any): any {
    if (typeof value !== 'string') {
      return value;
    }

    return value.replace(/\b\w/g, (match: string) => match.toUpperCase());
  }

}
