import { Injectable } from '@angular/core';
import { Firestore, FirestoreDataConverter, updateDoc, collection, collectionData, doc, getDoc, addDoc, query, orderBy } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Usuario{
  id?: string,
  nombre: string,
  apellido: string,
  edad: number,
  dni: number,
  especialidad: [],
  obraSocial: string,
  estaAprobado: number,
  perfil: string,
  mail: string,
  pass: string,
  ImgPerfil_1: string,
  ImgPerfil_2: string
}

export interface Especialidad{
  id?: any,
  especialidades: any
}

export interface Turno{
  id?: any,
  fecha_hora: string,
  estado: string,
  uid_especialista: string,
  uid_paciente: string,
  especialidad: string,
  nombre_pac: string,
  nombre_esp: string,
  apellido_pac: string,
  apellido_esp: string,
  dni_pac: string,
  dni_esp: string,
  mensajeRechazoEspecialista: string,
  mensajeDiagnosticoEspecialista: string,
  mensajeCancelacionPaciente : string,
  opinionPaciente: string,
  calificacionAtencion : string,
  estrellas: number,
  mensajeCancelacionAdmin: string,
  tieneHistClinico: boolean,
  mensajeCancelacionEsp: string
}

export interface DiasEspecialista{
  id?: any,
  diasElegidos: any
}

export interface HistClinico{
  id?:any,
  fecha_turno: string,
  fecha_cargaHist: string,
  altura: number,
  peso: number,
  presion: number,
  clave: string,
  valor: string,
  temperatura: number,
  uid_especialista: string,
  uid_paciente: string,
  foto_paciente: string,
  nombre_paciente:string,
  apellido_paciente: string,
  especialidad: string
}

export interface LogIngreso{
  id?:any,
  fecha_ingreso: number,
  usuario: string
}

@Injectable({
  providedIn: 'root'
})
export class BdService {
  public pacienteActivo = new BehaviorSubject<Usuario>(
    {nombre: "",apellido: "", especialidad: [], estaAprobado: -1, perfil:'', edad: 0, dni: 0, obraSocial:"", mail:"", pass:"", ImgPerfil_1:"", ImgPerfil_2:""});
  $getPacienteActivo = this.pacienteActivo.asObservable();
  pacienteNulo = {nombre: "",apellido: "", especialidad: [], estaAprobado: -1, perfil:'', edad: 0, dni: 0, obraSocial:"", mail:"", pass:"", imgPerfil1:"", imgPerfil2:""};

  constructor(private firestore : Firestore) { }

  getEspecialidades() : Observable<Especialidad[]>{
    const placeRef = collection(this.firestore, 'especialidades');
    return collectionData(placeRef, {idField: 'id'}) as Observable<Especialidad[]>;
  }

  getUsuarios() : Observable<Usuario[]>{
    const placeRef = collection(this.firestore, 'usuarios');
    return collectionData(placeRef, {idField: 'id'}) as Observable<Usuario[]>;
  }

  getUsuario(uid: string){ 
    const docRef = doc(this.firestore, "usuarios", uid);
    return getDoc(docRef);
  }

  getTurnos() : Observable<Turno[]>{
    const placeRef = collection(this.firestore, 'turnos');
    return collectionData(placeRef, {idField: 'id'}) as Observable<Turno[]>;
  }

  getDiasEspecialistas() : Observable<DiasEspecialista[]>{
    const placeRef = collection(this.firestore, 'especialistas');
    return collectionData(placeRef, {idField: 'id'}) as Observable<DiasEspecialista[]>;
  }

  getDiasEspecialista(uid : string){
    const placeRef = doc(this.firestore, 'especialistas', uid);
    return getDoc(placeRef);
  }

  //  getDiasElegidos(especialidad: string, uid : any): Observable<any[]> {
  //   const nombrePropiedad = 'diasElegidos' + especialidad;
  //   const docRef = doc(this.firestore, 'especialistas', uid);
  //   const docSnap = getDoc(docRef,()=>{});
  //   return 
  // }
  

  habilitarEstadoEsp(uid : any){
    const placeRef =  doc(this.firestore, "usuarios", uid);
    return updateDoc(placeRef, {estaAprobado: 1})
  }

  deshabilitarEstadoEsp(uid : any){
    const placeRef =  doc(this.firestore, "usuarios", uid);
    return updateDoc(placeRef, {estaAprobado: -1})
  }
  
  enviarPacienteActivo(data:any)
  {
    this.pacienteActivo.next(data);
  }

  //HIST. CLINICO
  getHistClinico() : Observable<HistClinico[]>{
    const placeRef = collection(this.firestore, 'historiaClinica');
    return collectionData(placeRef, {idField: 'id'}) as Observable<HistClinico[]>;
  }

  getFotoPaciente(uid : any){
    const placeRef = doc(this.firestore, 'usuarios', uid);
    getDoc(placeRef)
    .then((usr)=>{
      return usr.data()?.ImgPerfil_1;
    })
  }

  //INFORMES
  getLogIngreso() : Observable<LogIngreso[]>{
    const placeRef = query(collection(this.firestore, 'logsIngreso'), orderBy('fecha_ingreso', 'desc'));
    return collectionData(placeRef, {idField: 'id'}) as Observable<LogIngreso[]>;
  }

  uploadLogIngreso(log : LogIngreso){
    const placeRef = collection(this.firestore, 'logsIngreso');

    addDoc(placeRef,{
      usuario: log.usuario,
      fecha_ingreso: Date.now(),
    })
  }
}
