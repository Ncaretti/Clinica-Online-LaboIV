import { Component } from '@angular/core';
import { BdService, HistClinico, Usuario } from 'src/app/services/bd.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent {

  arrayHistorial: HistClinico[] = []; 
  arrayUsuarios : Usuario[] = [];
  arrayPacientes : Usuario[] = [];

  arrayHistorialUnico: HistClinico[] = [];

  constructor(private bdFire : BdService){}

  ngOnInit(){
    this.bdFire.getUsuarios().subscribe(data => this.arrayUsuarios = data);
    this.bdFire.getHistClinico().subscribe((data)=>{
      this.arrayHistorial = data;
      this.arrayHistorial.forEach((hist)=>{
        for(let i = 0; i < this.arrayUsuarios.length; i++)
        {
          if(this.arrayUsuarios[i].id == hist.uid_paciente && !this.arrayPacientes.includes(this.arrayUsuarios[i]))
          {
            this.arrayPacientes.push(this.arrayUsuarios[i]);
          }
        }
      })
    });
    setTimeout(()=>{
      console.log(this.arrayHistorial);
      console.log(this.arrayPacientes);
    }, 400);
  }

  historialCompleto(id : any)
  {
    console.log(id);
    this.arrayHistorial.forEach((hist)=>{
      if(id == hist.uid_paciente && !this.arrayHistorialUnico.includes(hist))
      {
        this.arrayHistorialUnico.push(hist);
      }
    })
    console.log(this.arrayHistorialUnico);
  }
}
