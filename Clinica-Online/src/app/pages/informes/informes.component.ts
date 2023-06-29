import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { BdService, LogIngreso, Turno } from 'src/app/services/bd.service';
import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  LinearScale,
  registerables,
} from 'chart.js/auto';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})
export class InformesComponent {

  arrayLogsIngreso: LogIngreso[] = [];
  arrayTurnos: Turno [] = [];
  contadorTurnosEsp: number[] = []
  contadorTurnosDia: number[] = [];

  constructor(private bdService : BdService){}
  
  ngOnInit(){
    this.bdService.getLogIngreso().subscribe(data => this.arrayLogsIngreso = data);
    this.bdService.getTurnos().subscribe(data => this.arrayTurnos = data);
    setTimeout(()=>{
      this.chartTurnosEspecialidad();
      this.chartTurnosDia();
    }, 1500);

  }

  descargarPDFLogs(nombre: string) {
  const DATA = document.getElementById(nombre);
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
    .then((docResult : any) => {
      docResult.save(nombre+'.pdf');
    });
  }

  descargarExcelLogs(){
    this.exportAsExcelFile(this.arrayLogsIngreso, 'logUsuarios_')
  }

  async chartTurnosEspecialidad() {
    const colors = [
      'green',
      'red',
      'blue',
      'yellow',
      'purple',
      'brown',
      'aqua',
    ];

    let i = 0;
    const turnosColores = this.arrayTurnos.map(
      (_ : any) => colors[(i = (i + 1) % colors.length)]
    );

    let especialidades : any[] = [];
    this.arrayTurnos.forEach((t) => {
      if(!especialidades.includes(t.especialidad))
      {
        especialidades.push(t.especialidad);
      }
    });

    let auxTurnos = [0, 0, 0];
    this.arrayTurnos.forEach((t) => {
      if (t.especialidad == 'Cardiologo') {
        auxTurnos[0]++;
      } else if (t.especialidad == 'Odontologo') {
        auxTurnos[1]++;
      } else if (t.especialidad == 'Dentista') {
        auxTurnos[2]++;
      }
    });

    this.contadorTurnosEsp = auxTurnos;

    new Chart('turnosEspecialidad', {
      type: 'pie',
      data: {
        labels: especialidades,
        datasets: [
          {
            data: auxTurnos,
            backgroundColor: turnosColores,
            borderColor: ['#000'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

  //adaptar, descarga excel
  descargarExcelTurnosEspecialidad() {
    const listaTurnos = [
      { especialidad: 'Cardiologo', turnos: 0 },
      { especialidad: 'Odontologo', turnos: 0 },
      { especialidad: 'Dentista', turnos: 0 },
    ];
    this.arrayTurnos.forEach((t) => {
      if (t.especialidad == 'Cardiologo') {
        listaTurnos[0].turnos++;
      } else if (t.especialidad == 'Odontologo') {
        listaTurnos[1].turnos++;
      } else if (t.especialidad == 'Dentista') {
        listaTurnos[2].turnos++;
      }
    });
    this.exportAsExcelFile(listaTurnos, 'turnosEspecialidad_');
  }

  async chartTurnosDia() {
    const colors = [
      'yellow',
      'green',
      'blue',
      'red',
      'purple',
      'brown',
      'aqua',
    ];

    let i = 0;
    const turnosColores = this.arrayTurnos.map(
      (_ : any) => colors[(i = (i + 1) % colors.length)]
    );

    let arrayTurnosDia = [0, 0, 0, 0, 0, 0];
    this.arrayTurnos.forEach((t) => {
      if (new Date(t.fecha_hora).getDay() == 1) {
        arrayTurnosDia[0]++;
      } else if (new Date(t.fecha_hora).getDay() == 2) {
        arrayTurnosDia[1]++;
      } else if (new Date(t.fecha_hora).getDay() == 3) {
        arrayTurnosDia[2]++;
      } else if (new Date(t.fecha_hora).getDay() == 4) {
        arrayTurnosDia[3]++;
      } else if (new Date(t.fecha_hora).getDay() == 5) {
        arrayTurnosDia[4]++;
      } else if (new Date(t.fecha_hora).getDay() == 6) {
        arrayTurnosDia[5]++;
      }
    });

    this.contadorTurnosDia = arrayTurnosDia;

    new Chart('turnosDia', {
      type: 'pie',
      data: {
        labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
        datasets: [
          {
            data: arrayTurnosDia,
            backgroundColor: turnosColores,
            borderColor: ['#000'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

  descargarExcelTurnosDia() {
    const listaTurnosPorDia = [
      {
        Fecha: new Date(),
        Lunes: 0,
        Martes: 0,
        Miercoles: 0,
        Jueves: 0,
        Viernes: 0,
        Sabado: 0,
      },
    ];
    this.arrayTurnos.forEach((t) => {
      if (new Date(t.fecha_hora).getDay() == 1) {
        listaTurnosPorDia[0].Lunes++;
      } else if (new Date(t.fecha_hora).getDay() == 2) {
        listaTurnosPorDia[0].Martes++;
      } else if (new Date(t.fecha_hora).getDay() == 3) {
        listaTurnosPorDia[0].Miercoles++;
      } else if (new Date(t.fecha_hora).getDay() == 4) {
        listaTurnosPorDia[0].Jueves++;
      } else if (new Date(t.fecha_hora).getDay() == 5) {
        listaTurnosPorDia[0].Viernes++;
      } else if (new Date(t.fecha_hora).getDay() == 6) {
        listaTurnosPorDia[0].Sabado++;
      }
    });
    this.exportAsExcelFile(listaTurnosPorDia, 'turnosDia_');
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
}
