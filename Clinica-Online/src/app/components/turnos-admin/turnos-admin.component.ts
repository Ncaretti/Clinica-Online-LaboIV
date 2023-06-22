import { Component } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { BdService, Turno } from 'src/app/services/bd.service';

@Component({
  selector: 'app-turnos-admin',
  templateUrl: './turnos-admin.component.html',
  styleUrls: ['./turnos-admin.component.css']
})
export class TurnosAdminComponent {

  arrayTurnos: Turno[] = [];
  usuarioActual : any;
  icono!:string;
  estadoBoton: any = {};
  verResenia: boolean = false;
  verEncuesta: boolean = false;
  verAtencion: boolean = false;
  valorEstrellas : number = 0;

  constructor(private bd : BdService, private bdFire : Firestore){}

  async ngOnInit()
  {
    this.arrayTurnos = [];
    this.bd.$getPacienteActivo.subscribe(data => this.usuarioActual = data);
    this.bd.getTurnos().subscribe(data => this.arrayTurnos = data);
    setTimeout(()=>{
      console.log(this.usuarioActual);
      console.log(this.arrayTurnos);
    }, 200)
  }


  obtenerEstado(estado: string): string {
    switch (estado) {
      case 'aceptado':
        return 'estado-aceptado';
      case 'rechazado':
        return 'estado-rechazado';
      case 'espera':
        return 'estado-espera';
      case 'finalizado':
        return 'estado-finalizado';
      default:
        return '';
      case 'cancelado':
        return 'estado-cancelado';
    }
  }

  pathIcono(estado: string):string{
    switch(estado){
      case 'espera':
        return '../../../assets/pregunta.png';
      case 'aceptado':
        return '../../../assets/check.png';
      case 'rechazado':
        return '../../../assets/error.png';
      case 'finalizado':
        return '../../../assets/info.png';
      default:
        return '';
      case 'cancelado':
        return '../../../assets/cancel.png';
    }
  }

  //Ambos
  respuestaTurno(turno: any, decision : string){
    const turnoRef = doc(this.bdFire, 'turnos', turno.id)
    setDoc(turnoRef, {
      estado: decision
    }, {merge: true});
  }

  cancelarTurnoAdmin(id : any, estado: string){
    (document.getElementById(id + 10) as HTMLInputElement).className = "desactivar-boton";
    this.estadoBoton = {id: id, estado: estado};
    console.log(this.estadoBoton);
  }

  turnoCanceladoAdmin(turno: any){
    console.log((document.getElementById(turno.id + 11) as HTMLInputElement).value);
    let mensaje = (document.getElementById(turno.id + 11) as HTMLInputElement).value;

    const turnoRef = doc(this.bdFire, 'turnos', turno.id);
    if((document.getElementById(turno.id + 11) as HTMLInputElement).value != '')
    {
      setDoc(turnoRef, {
        mensajeCancelacionAdmin: mensaje
      },{merge: true});

      this.respuestaTurno(turno, 'cancelado');
      this.estadoBoton = {};
    }
  }
}
