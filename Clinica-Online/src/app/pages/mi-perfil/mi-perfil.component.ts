import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, addDoc, collection, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { BdService } from 'src/app/services/bd.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent {

  usuarioActual! : any;
  diasEspecialista : boolean = false;
  guardarEspecialidad!:any;
  diasSemana : any[] = [{posicion: 1, dia:"Lunes"}, {posicion: 2, dia:"Martes"}, {posicion: 3, dia: "Miercoles"}, {posicion: 4, dia: "Jueves"}, {posicion: 5, dia: "Viernes"}, {posicion: 6, dia: "Sabado"}];
  diasSeleccionados: any[] = [];
  arrayDiasEspecialistas: any[] =[];

  constructor(private firestore : Firestore ,private bdService : BdService, private bd : Firestore){}

  ngOnInit()
  {
    this.bdService.$getPacienteActivo.subscribe(data => this.usuarioActual = data);
  }

  async getDiasElegidos(especialidad: string): Promise<any[]> {
    this.diasSeleccionados = [];
    const nombrePropiedad = 'diasElegidos' + especialidad;
  
    try {
      const docRef = doc(this.firestore, 'especialistas', this.usuarioActual.id);
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

  mostrarDias(esp : any)
  {
    this.diasEspecialista = true;
    this.guardarEspecialidad = esp;

    setTimeout(()=>{
      for(let i = 0; i <= this.diasSemana.length; i++)
      {
        if(this.diasSemana[i] != undefined)
        {
          document.getElementById(this.diasSemana[i].dia)!.className = "btn btn-success";
          // console.log(document.getElementById(this.diasSemana[i]));
          // console.log(this.diasSemana[i]);
        }
      }
      this.getDiasElegidos(esp)
      .then((data: any[])=>{
        // console.log(data);
        this.diasSeleccionados = data;

        for(let i = 0; i <= this.diasSeleccionados.length; i++)
        {
          for(let j = 0; j <= (this.diasSemana.length - 1); j++)
          {
            if(this.diasSeleccionados[i] == this.diasSemana[j].posicion && this.diasSeleccionados[i] != undefined && this.diasSemana[j].posicion != undefined)
            {
              document.getElementById(this.diasSemana[j].dia)!.className = "btn btn-danger";
            }
          }
        }
      })
    })
  }
  
  estaEnLista(dia : any, indice : any)
  {
    let esta = false;
    let j = -1;

    for(let i = 0; i <= this.diasSeleccionados.length; i++)
    {
      j++;
      // console.log(this.diasSeleccionados[i]);
      if(this.diasSeleccionados[i] == dia)
      {
        // console.log("entro a dia repetido");
        esta = true;
        break;
      }
    }

    if(!esta)
    {
      this.diasSeleccionados.push(indice + 1);
      document.getElementsByTagName('button')[(indice + 2)]!.className = "btn btn-danger";
    }
    else{
      this.diasSeleccionados.splice(j, 1);
      document.getElementsByTagName('button')[(indice + 2)]!.className = "btn btn-success";
    }

    const ref = doc(this.bd, 'especialistas', this.usuarioActual.id);
    setDoc(ref,{
      ['diasElegidos'+ this.guardarEspecialidad]: this.diasSeleccionados
    }, {merge: true})
    // console.log(this.diasSeleccionados);
    // console.log(dia);
  }
}
