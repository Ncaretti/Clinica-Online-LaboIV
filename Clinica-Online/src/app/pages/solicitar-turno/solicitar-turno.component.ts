import { Component } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BdService, Especialidad, Turno } from 'src/app/services/bd.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.css']
})
export class SolicitarTurnoComponent {

  pacienteActivo!: any;
  mostrarEspecialista : boolean = false;
  mostrarTurno : boolean = false;
  arrayUsuarios! : any;
  obtenerEspecialidades!:any;
  arrayEspecialistas : any [] = [];
  arrayEspecialidades : Especialidad [] = [];
  especialistaElegido! : any;
  especialidadElegida! : any;
  arrayTurnos : Turno [] = [];

  currentDate!:any;
  startDate!:any;
  fechasDisponibles!:any;
  fechaSeleccionada!:any;
  horariosDisponibles!:any;
  horariosSeleccionados: Date[] = [];
  diasQueVan: number[] = [];
  horarioSeleccionado: Date | null = null;

  constructor(private sweet : NotificacionesService ,private router : Router ,private bd : BdService,  private db : Firestore){
    this.currentDate = new Date();
    this.startDate = new Date();
    this.startDate.setDate(this.startDate.getDate());
    // this.fechasDisponibles = this.generateFechas();
    this.fechaSeleccionada = null;
    this.horariosDisponibles = [];
  }

  async ngOnInit()
  {
    this.bd.getUsuarios().subscribe(data => this.arrayUsuarios = data);
    this.bd.getEspecialidades().subscribe(data => this.obtenerEspecialidades = data);
    this.bd.$getPacienteActivo.subscribe(data => this.pacienteActivo = data);
    this.bd.getTurnos().subscribe(data => this.arrayTurnos = data);

    setTimeout(() => {
      console.log(this.arrayTurnos);
      this.arrayEspecialidades = this.obtenerEspecialidades[0].especialidades;
      this.arrayTurnos.forEach((turno)=>{
        if(turno != undefined)
        {
          // console.log(turno.fecha_hora);
          let fecha = new Date(turno.fecha_hora);
          this.horariosSeleccionados.push(fecha);
        }
      })

      for(let i = 0; i < this.obtenerEspecialidades.length; i++)
      {
        console.log(this.obtenerEspecialidades[i].especialidades);
      }
    }, 800);
  }

  async getDiasElegidos(especialidad: string): Promise<any[]> {
    const nombrePropiedad = 'diasElegidos' + especialidad;
    console.log(this.especialistaElegido.id);
    try {
      const docRef = doc(this.db, 'especialistas', this.especialistaElegido.id);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists() && docSnap.data() && docSnap.data()![nombrePropiedad]) {
        console.log(docSnap.data()![nombrePropiedad]);
        return docSnap.data()![nombrePropiedad];
      } else {

        throw new Error('No se encontraron días elegidos para la especialidad.');
      }
    } catch (error) {
      throw error;
    }
  }

  mostrarEsp(especialidad : any)
  {
    this.arrayEspecialistas = [];

    this.arrayUsuarios.forEach((usuario : any) => {
      if(usuario.perfil == 'especialista' && usuario.estaAprobado == 1)
      {
        usuario.especialidad.forEach((esp : any) => {
          if(esp == especialidad)
          {
            console.log(esp);
            this.arrayEspecialistas.push(usuario);
            this.especialidadElegida = especialidad;
          }
        });
      }
    });

    this.horarioSeleccionado = null;
    this.mostrarTurno = false;
    this.fechaSeleccionada = false;
    this.mostrarEspecialista = false;
    setTimeout(()=>{
      this.mostrarEspecialista = true;
    }, 100);
  }

  mostrarTurn(especialista : string)
  {
    this.mostrarTurno = false;
    this.fechaSeleccionada = false;
    setTimeout(()=>{
      this.mostrarTurno = true;
    }, 100);
    this.horarioSeleccionado = null;
    this.especialistaElegido = especialista;
    console.log(this.especialidadElegida);
    this.getDiasElegidos(this.especialidadElegida)
    .then((data : any[])=>{
      this.diasQueVan = data;
      this.fechasDisponibles = this.generateFechas();
    });
  }


  generateFechas(): Date[] {
    const fechas: Date[] = [];
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.startDate);
    endDate.setDate(endDate.getDate()  + 15);
  
    let currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      console.log("ALGO");
      if (this.diasQueVan.includes(currentDate.getDay())) {
        fechas.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return fechas;
  }

  selectFecha(fecha: Date) {
    this.fechaSeleccionada = fecha;
    this.horarioSeleccionado = null;
    this.horariosDisponibles = this.generateHorarios();
  }

  selectHorario(horario: Date) {
    if (this.horarioSeleccionado && this.horarioSeleccionado.getTime() === horario.getTime()) {
      this.horarioSeleccionado = null;
    } else {
      this.horarioSeleccionado = horario;
    }
  }

  generateHorarios(): Date[] {
    const horarios: Date[] = [];
    const startDate = new Date(this.fechaSeleccionada!.getFullYear(), this.fechaSeleccionada!.getMonth(), this.fechaSeleccionada!.getDate(), 8, 0, 0);
    const endDate = new Date(this.fechaSeleccionada!.getFullYear(), this.fechaSeleccionada!.getMonth(), this.fechaSeleccionada!.getDate(), 19, 0, 0);

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (!this.horariosSeleccionados.find(horario => horario.getTime() === currentDate.getTime())) {
        horarios.push(new Date(currentDate));
      }
      currentDate.setMinutes(currentDate.getMinutes() + 30);
    }

    return horarios;
  }

  cargarTurnoBD(){
    console.log(this.especialistaElegido.id);
    console.log(this.horarioSeleccionado);
    console.log(this.especialidadElegida);
    console.log(this.pacienteActivo.id);
    const ref = collection(this.db, 'turnos');
    addDoc(ref, {
      uid_especialista: this.especialistaElegido.id,
      uid_paciente: this.pacienteActivo.id,
      fecha_hora: this.horarioSeleccionado?.toString(),
      especialidad: this.especialidadElegida,
      nombre_esp: this.especialistaElegido.nombre,
      nombre_pac: this.pacienteActivo.nombre,
      apellido_esp: this.especialistaElegido.apellido,
      apellido_pac: this.pacienteActivo.apellido,
      dni_pac: this.pacienteActivo.dni,
      dni_esp: this.especialistaElegido.dni,
      estado: 'espera'
    })
    .then(()=>{
      this.sweet.alertas("Turno cargado con exito", "success");
      setTimeout(()=>{
        this.router.navigate(['/mis-turnos']);
      },250);
    })
  }
}