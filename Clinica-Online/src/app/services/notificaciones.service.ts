import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor() { }

  alertasLogin(titulo: any, icono: any, textoBoton:any)
  {
    Swal.fire({
      title: titulo,
      icon: icono,
      confirmButtonText: textoBoton
    })
  }

  alertas(titulo: any, icono: any)
  {
    Swal.fire({
      title: titulo,
      icon: icono
    })
  }

  alertasAuth(error: any)
  {
    switch(error)
    {
      case 'auth/invalid-email':
        this.alertasLogin("Correo invalido", "error", "Ok");
      break;
      case 'auth/invalid-password':
        this.alertasLogin("La contraseña debe tener al menos 6 caracteres.", "error", "Ok");
      break;
      case 'auth/internal-error':
        this.alertasLogin("Ocurrio un error en la solicitud.", "error", "Ok");
      break;
      default:
        this.alertasLogin("Usuario y/o contraseña erroneo/s.", "error", "Ok");
      break;
    }
  }
}
