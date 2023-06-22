import { Injectable } from '@angular/core';
import { Firestore, FirestoreDataConverter, updateDoc, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
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
  imgPerfil1: string,
  imgPerfil2: string
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
  mensajeCancelacionAdmin: string
}

export interface DiasEspecialista{
  id?: any,
  diasElegidos: any
}

@Injectable({
  providedIn: 'root'
})
export class BdService {
  private pacienteActivo = new BehaviorSubject<Usuario>(
    {nombre: "",apellido: "", especialidad: [], estaAprobado: -1, perfil:'', edad: 0, dni: 0, obraSocial:"", mail:"", pass:"", imgPerfil1:"", imgPerfil2:""});
  $getPacienteActivo = this.pacienteActivo.asObservable();

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
}
