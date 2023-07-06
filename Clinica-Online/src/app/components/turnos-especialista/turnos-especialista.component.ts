import { Component } from '@angular/core';
import { Firestore, addDoc, collection, doc, setDoc } from '@angular/fire/firestore';
import { BdService, Turno } from 'src/app/services/bd.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

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
  valorEstrellas : number = 0;
  arrayTurnosAMostrar: Turno[] = [];
  arrayBusqueda : any [] = [];
  mostrarDiv: boolean = false;
  searchText = ''; 

  peso!: number;
  altura!: number;
  temperatura!: number;
  presion!: number;
  clave: string = '';
  valor: string = '';

  constructor(private bd : BdService, private bdFire : Firestore, private mensaje : NotificacionesService){}

  async ngOnInit()
  {
    this.arrayTurnos = [];
    this.bd.$getPacienteActivo.subscribe(data => this.usuarioActual = data);
    this.bd.getTurnos().subscribe(data => this.arrayTurnosAMostrar = data);

    setTimeout(()=>{
      console.log(this.usuarioActual);
      console.log(this.arrayTurnosAMostrar);
      this.arrayTurnos = this.arrayTurnosAMostrar;
      let apellidos_pac : string[] = [];
      let especialidades : string[] = [];

      this.arrayTurnos.forEach((turno)=>{
        if(!apellidos_pac.includes(turno.apellido_pac) && this.usuarioActual.id == turno.uid_especialista)
        {
          apellidos_pac.push(turno.apellido_pac)
        }
        if(!especialidades.includes(turno.especialidad) && this.usuarioActual.id == turno.uid_especialista)
        {
          especialidades.push(turno.especialidad)
        }
      })

      this.arrayBusqueda = apellidos_pac.concat(especialidades);
      console.log(this.arrayBusqueda);
    }, 700)
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

  desactivarGenerico(id: any, estado: string, suma: number)
  {
    (document.getElementById(id + suma) as HTMLInputElement).className = "desactivar-boton";
    this.estadoBoton = {id: id, estado: estado};
    console.log(this.estadoBoton);
  }

  cargarHistClinica(turno: Turno)
  {
    if(this.peso != undefined && this.altura != undefined && this.temperatura != undefined && 
    this.presion != undefined && this.clave != '' && this.valor != '')
    {
      const ref = collection(this.bdFire, 'historiaClinica');
      const refTurnos = doc(this.bdFire, 'turnos', turno.id);
      let fecha = Date.now();
      // let fotoPaciente = this.bd.getFotoPaciente(turno.uid_paciente);

      this.bd.getUsuario(turno.uid_paciente)
      .then((usr)=>{
        addDoc(ref, {
          temperatura: this.temperatura,
          peso: this.peso,
          altura: this.altura,
          presion: this.presion,
          clave: this.clave,
          valor: this.valor,
          fecha_cargaHist: fecha,
          fecha_turno: turno.fecha_hora,
          uid_paciente: turno.uid_paciente,
          uid_especialista: turno.uid_especialista,
          foto_paciente: usr.data()?.ImgPerfil_1,
          nombre_paciente: usr.data()?.nombre,
          apellido_paciente: usr.data()?.apellido,
          especialidad: turno.especialidad
        })
        .then(()=>{
          setDoc(refTurnos, {
            tieneHistClinico: true
          }, {merge: true})
          .then(()=>{
            this.mensaje.alertas('Historial clinico cargado con exito.', 'success');
            this.estadoBoton = {};
          })
        })
      })
    }
    else
    {
      this.mensaje.alertas('Complete todos los campos', 'error');
    }
  }

  turnoCancelado(turno: any)
  {
    console.log((document.getElementById(turno.id + 16) as HTMLInputElement).value);
    let mensaje = (document.getElementById(turno.id + 16) as HTMLInputElement).value;

    const turnoRef = doc(this.bdFire, 'turnos', turno.id);
    if((document.getElementById(turno.id + 16) as HTMLInputElement).value != '')
    {
      setDoc(turnoRef, {
        mensajeCancelacionEsp: mensaje
      },{merge: true});

      this.respuestaTurno(turno, 'cancelado');
      this.estadoBoton = {};
    }
  }

  filtrarTurnos(t: string){
    console.log(t);
    this.arrayTurnosAMostrar = [];
    if(t != 'limpiar')
    {
      (document.getElementById("search-text") as HTMLInputElement).value = t;
      console.log(t);
      this.arrayTurnos.forEach(turno =>{
  
        if(turno.especialidad == t || turno.apellido_pac == t){
          this.arrayTurnosAMostrar.push(turno);
        }
      })
    }
    else
    {
      (document.getElementById("search-text") as HTMLInputElement).value = '';
      this.arrayTurnosAMostrar = this.arrayTurnos;
    }
    
    this.ocultarDiv();
  }

  toggleDiv() {
    this.mostrarDiv = !this.mostrarDiv;
  }
  
  ocultarDiv() {
    setTimeout(() => {
      this.mostrarDiv = false;
    }, 100);
  }
}
