import { Injectable } from '@angular/core';
import { Firestore, FirestoreDataConverter, collection, collectionData } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Usuario{
  id?: string,
  nombre: string,
  apellido: string,
  edad: number,
  dni: number,
  especialidad: string,
  obraSocial: string,
  perfil: string,
  mail: string,
  pass: string,
  imgPerfil1: string,
  imgPerfil2: string
}

// export interface Paciente{
//   id?: string,
//   nombre: string,
//   apellido: string,
//   edad: number,
//   dni: number,
//   obraSocial: string,
//   perfil: string,
//   mail: string,
//   pass: string,
//   imgPerfil1: string,
//   imgPerfil2: string
// }

@Injectable({
  providedIn: 'root'
})
export class BdService {
  private pacienteActivo = new BehaviorSubject<Usuario>(
    {nombre: "",apellido: "", especialidad: '' , perfil:'', edad: 0, dni: 0, obraSocial:"", mail:"", pass:"", imgPerfil1:"", imgPerfil2:""});
  $getPacienteActivo = this.pacienteActivo.asObservable();

  constructor(private firestore : Firestore) { }

  // getEspecialistas() : Observable<Especialista[]>{
  //   const placeRef = collection(this.firestore, 'especialistas');
  //   return collectionData(placeRef, {idField: 'id'}) as Observable<Especialista[]>;
  // }

  // getPacientes() : Observable<Paciente[]>{
  //   const placeRef = collection(this.firestore, 'pacientes');
  //   return collectionData(placeRef, {idField: 'id'}) as Observable<Paciente[]>;
  // }

  getUsuarios() : Observable<Usuario[]>{
    const placeRef = collection(this.firestore, 'usuarios');
    return collectionData(placeRef, {idField: 'id'}) as Observable<Usuario[]>;
  }

  enviarPacienteActivo(data:any)
  {
    this.pacienteActivo.next(data);
  }
}
