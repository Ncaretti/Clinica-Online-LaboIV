import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'fechaSolicitarTurno'
})
export class FechaSolicitarTurnoPipe implements PipeTransform {

  transform(fecha: string): string | null {
    const formatoEntrada = 'EEE, MMM d, yyyy h:mm a \'GMT\'Z';
    const formatoSalida = 'dd-MM, HH:mm';

    const fechaObjeto = new Date(fecha);
    const fechaTransformada = new DatePipe('en-US').transform(fechaObjeto, formatoSalida);

    return fechaTransformada;
  }

}
