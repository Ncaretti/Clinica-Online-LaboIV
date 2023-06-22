import { Component } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { BdService, Turno } from 'src/app/services/bd.service';

@Component({
  selector: 'app-turnos-especialista',
  templateUrl: './turnos-especialista.component.html',
  styleUrls: ['./turnos-especialista.component.css']
})
export class TurnosEspecialistaComponent {

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

  
  turnoRechazado(turno: any){
    let mensaje = (document.getElementById(turno.id + 2) as HTMLInputElement).value;

    const turnoRef = doc(this.bdFire, 'turnos', turno.id);
    if((document.getElementById(turno.id + 2) as HTMLInputElement).value != '')
    {
      console.log("entro aca?")
      setDoc(turnoRef, {
        mensajeRechazoEspecialista: mensaje
      },{merge: true});

      this.respuestaTurno(turno, 'rechazado');
      this.estadoBoton = {};
    }
  }

  turnoFinalizado(turno: any)
  {
    console.log((document.getElementById(turno.id + 4) as HTMLInputElement).value);
    let mensaje = (document.getElementById(turno.id + 4) as HTMLInputElement).value;

    const turnoRef = doc(this.bdFire, 'turnos', turno.id);
    if((document.getElementById(turno.id + 4) as HTMLInputElement).value != '')
    {
      setDoc(turnoRef, {
        mensajeDiagnosticoEspecialista: mensaje
      },{merge: true});

      this.respuestaTurno(turno, 'finalizado');
      this.estadoBoton = {};
    }
  }

  consola(id : any, estado : string)
  {
    (document.getElementById(id) as HTMLInputElement).className = "desactivar-boton";
    (document.getElementById(id + 1) as HTMLInputElement).className = "desactivar-boton";
    this.estadoBoton = {id: id, estado: estado};
    console.log(this.estadoBoton);
  }

  desactivarFinalizar(id: any, estado: string)
  {
    (document.getElementById(id + 3) as HTMLInputElement).className = "desactivar-boton";
    this.estadoBoton = {id: id, estado: estado};
    console.log(this.estadoBoton);
  }
}
