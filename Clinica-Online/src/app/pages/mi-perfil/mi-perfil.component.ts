import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, addDoc, collection, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { BdService, Especialidad, HistClinico } from 'src/app/services/bd.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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

  arrayEspecialidades: Especialidad[] = [];
  arrayHistClinico: HistClinico[] = [];
  auxArrayHist: HistClinico[] = [];

  constructor(private firestore : Firestore ,private bdService : BdService, private bd : Firestore){}

  ngOnInit()
  {
    let arrayTemportal = [];
    this.bdService.$getPacienteActivo.subscribe(data => this.usuarioActual = data);
    this.bdService.getHistClinico().subscribe((data)=>{
      let otroArray = data;

      otroArray.forEach((hist)=>{
        if(!this.arrayHistClinico.includes(hist) && hist.uid_paciente == this.usuarioActual.id)
        {
          this.arrayHistClinico.push(hist);
        }
      })
    });
    this.bdService.getEspecialidades().subscribe((data)=>{
      arrayTemportal = data;
      arrayTemportal.forEach((esp)=>{
        for(let i = 0; i  < esp.especialidades.length; i++)
        {
          for(let j = 0; j < this.arrayHistClinico.length; j++)
          {
            if(esp.especialidades[i] == this.arrayHistClinico[j].especialidad && !this.arrayEspecialidades.includes(esp.especialidades[i]))
            {
              this.arrayEspecialidades.push(esp.especialidades[i]);
            }
          }
        }
      })
    });
    this.auxArrayHist = this.arrayHistClinico;
    console.log(this.arrayHistClinico);
  }


  //ESPECIALISTA
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
      document.getElementsByTagName('button')[(indice + (this.usuarioActual.especialidad.length))]!.className = "btn btn-danger";
    }
    else{
      this.diasSeleccionados.splice(j, 1);
      document.getElementsByTagName('button')[(indice + (this.usuarioActual.especialidad.length))]!.className = "btn btn-success";
    }

    const ref = doc(this.bd, 'especialistas', this.usuarioActual.id);
    setDoc(ref,{
      ['diasElegidos'+ this.guardarEspecialidad]: this.diasSeleccionados
    }, {merge: true})
    // console.log(this.diasSeleccionados);
    // console.log(dia);
  }


  //PACIENTE
  filtroEspecialidad(id: any, esp: any)
  {
    console.log(esp);
    console.log(document.getElementsByTagName('button')[(id + 1)]);
    if((document.getElementsByTagName('button')[(id + 1)] as HTMLInputElement).className == "btn btn-danger ng-star-inserted")
    {
      (document.getElementsByTagName('button')[(id + 1)] as HTMLInputElement).className = "btn btn-primary ng-star-inserted";
      this.arrayHistClinico = [];
      this.arrayHistClinico = this.auxArrayHist;
    }
    else if((document.getElementsByTagName('button')[(id + 1)] as HTMLInputElement).className == "btn btn-primary ng-star-inserted")
    {
      console.log("entre");
      let arrayAux = this.auxArrayHist;
      this.arrayHistClinico = [];
      (document.getElementsByTagName('button')[(id + 1)] as HTMLInputElement).className = "btn btn-danger ng-star-inserted";
      for(let i = 0; i < arrayAux.length; i++)
      {
        if(arrayAux[i].especialidad == esp && !this.arrayHistClinico.includes(arrayAux[i]))
        {
          this.arrayHistClinico.push(arrayAux[i]);
        }
      }
      console.log(this.arrayHistClinico);
    }
  }

  crearPDF() {
    const DATA = document.getElementById('pdf');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    //@ts-ignore
    html2canvas(DATA, options)
      .then((canvas : any) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        docResult.save(`historial_clinico.pdf`);
      });
  }

}
