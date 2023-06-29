import { Component } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { BdService, Turno } from 'src/app/services/bd.service';

@Component({
  selector: 'app-turnos-paciente',
  templateUrl: './turnos-paciente.component.html',
  styleUrls: ['./turnos-paciente.component.css']
})
export class TurnosPacienteComponent {
  arrayTurnos: Turno[] = [];
  usuarioActual : any;
  icono!:string;
  estadoBoton: any = {};
  verResenia: boolean = false;
  verEncuesta: boolean = false;
  verAtencion: boolean = false;
  valorEstrellas : number = 0;
  title = 'angular-text-search-highlight';
  searchText = '';
  characters = [
    'Ant-Man',
    'Aquaman',
    'Asterix',
    'The Atom',
    'The Avengers',
    'Batgirl',
    'Batman',
    'Batwoman'
  ];

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

  
  cancelarTurno(id : any, estado: string){
    (document.getElementById(id + 6) as HTMLInputElement).className = "desactivar-boton";
    this.estadoBoton = {id: id, estado: estado};
    console.log(this.estadoBoton);
  }

  turnoCancelado(turno : any){
    console.log((document.getElementById(turno.id + 7) as HTMLInputElement).value);
    let mensaje = (document.getElementById(turno.id + 7) as HTMLInputElement).value;

    const turnoRef = doc(this.bdFire, 'turnos', turno.id);
    if((document.getElementById(turno.id + 7) as HTMLInputElement).value != '')
    {
      setDoc(turnoRef, {
        mensajeCancelacionPaciente: mensaje
      },{merge: true});

      this.respuestaTurno(turno, 'cancelado');
      this.estadoBoton = {};
    }
  }

  encuestaPaciente(turno : any){
    let mensaje = (document.getElementById(turno.id + 8) as HTMLInputElement).value;
    this.verEncuesta = false;

    const turnoRef = doc(this.bdFire, 'turnos', turno.id);
    if((document.getElementById(turno.id + 8) as HTMLInputElement).value != '')
    {
      setDoc(turnoRef, {
        opinionPaciente: mensaje
      },{merge: true});
    }
    this.estadoBoton = {};
  }

  darCalificacion(id : any, estado: string, suma: number){
    this.verAtencion = true;
    (document.getElementById(id + suma) as HTMLInputElement).className = "desactivar-boton";
    this.estadoBoton = {id: id, estado: estado};
    console.log(this.estadoBoton);
  }

  ocultarResenia(){
    this.estadoBoton = {};
  }

  cargarAtencion(turno: any, cantEstrellas: number){
    let mensaje = (document.getElementById(turno.id + 9) as HTMLInputElement).value;
    this.verAtencion = false;

    const turnoRef = doc(this.bdFire, 'turnos', turno.id);
    if((document.getElementById(turno.id + 9) as HTMLInputElement).value != '')
    {
      setDoc(turnoRef, {
        calificacionAtencion: mensaje,
        estrellas: cantEstrellas
      },{merge: true});
    }
    this.valorEstrellas = 0;
    this.verAtencion = false;
    this.estadoBoton = {};
    // this.ngOnInit();
    console.log(this.arrayTurnos);
  }
}
