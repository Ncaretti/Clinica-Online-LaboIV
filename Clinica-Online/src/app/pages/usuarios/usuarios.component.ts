import { Component } from '@angular/core';
import { BdService, HistClinico, Turno, Usuario } from 'src/app/services/bd.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as FileSaver from 'file-saver';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {

  show : boolean = false;
  arrayUsuarios : Usuario [] = [];
  arrayTurnos : Turno [] = [];
  usuarioActivo: any;
  arrayUsuariosTurno: Usuario [] = [];
  arrayUsuariosDescarga : any [] = [];
  arrayHistClinico: HistClinico [] = [];
  arrayHistUnico: HistClinico [] = [];
  arrayTurnosUnico: Turno [] = [];

  constructor(private bdFire : BdService, private authBd : Auth, private router : Router, private mensaje : NotificacionesService){}

  ngOnInit(){
    this.show = true;
    this.bdFire.getUsuarios().subscribe(data => this.arrayUsuarios = data);
    this.bdFire.getTurnos().subscribe(data => this.arrayTurnos = data);
    this.bdFire.$getPacienteActivo.subscribe(data => this.usuarioActivo = data);
    this.bdFire.getHistClinico().subscribe(data => this.arrayHistClinico = data);
    setTimeout(()=>{
      this.arrayUsuarios.forEach((usr)=>{
        console.log(usr.id);
        for(let i = 0; i < this.arrayTurnos.length; i++)
        {
          console.log(usr.id);
          console.log(this.arrayTurnos[i].uid_paciente);
          if(usr.id == this.arrayTurnos[i].uid_paciente || usr.id == this.arrayTurnos[i].uid_especialista && !this.arrayUsuariosTurno.includes(usr))
          {
            this.arrayUsuariosTurno.push(usr);
          }
        }
      })

      this.arrayUsuariosDescarga = this.arrayUsuarios.map(({ estaAprobado, especialidad, id, pass, ImgPerfil_1, ImgPerfil_2, ...resto }) => resto);
      console.log(this.arrayUsuariosDescarga);
      this.show = false;
    }, 1500)
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  descargarExcel() {
    this.exportAsExcelFile(this.arrayUsuariosDescarga, 'usuarios');
  }

  descargarTurnos(user : Usuario){

    let arrayAux : any[] = [];
    if(user.perfil == 'paciente')
    {
      this.arrayTurnos.forEach((turno)=>{
        if(turno.uid_paciente == user.id && !arrayAux.includes({nombre_esp: turno.nombre_esp, apellido_esp: turno.apellido_esp, 
          fecha_turno: turno.fecha_hora}))
        {
          arrayAux.push({nombre_esp: turno.nombre_esp, apellido_esp: turno.apellido_esp, 
          fecha_turno: turno.fecha_hora});
        }
      })
      this.exportAsExcelFile(arrayAux, 'turnosPaciente_'+user.nombre+'_'+user.apellido+'_');
    }
    else if(user.perfil == 'especialista')
    {
      this.arrayTurnos.forEach((turno)=>{
        if(turno.uid_especialista == user.id && !arrayAux.includes({nombre_pac: turno.nombre_pac, apellido_pac: turno.apellido_pac, 
          fecha_turno: turno.fecha_hora}))
        {
          arrayAux.push({nombre_pac: turno.nombre_pac, apellido_pac: turno.apellido_pac, 
          fecha_turno: turno.fecha_hora});
        }
      })
      this.exportAsExcelFile(arrayAux, 'turnosEspecialista'+user.nombre+'_'+user.apellido+'_');
    }
  }

  historialCompleto(id : any)
  {
    this.arrayHistUnico = [];
    console.log(id);
    this.arrayHistClinico.forEach((hist)=>{
      if(id == hist.uid_paciente && !this.arrayHistUnico.includes(hist))
      {
        this.arrayHistUnico.push(hist);
      }
    })
  }

  turnosCompleto(id : any){
    this.arrayTurnosUnico = [];

    this.arrayTurnos.forEach((turn)=>{
      if(id == turn.uid_paciente && !this.arrayTurnosUnico.includes(turn))
      {
        this.arrayTurnosUnico.push(turn);
      }
    })
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
}
