import { Component } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { BdService, Turno } from 'src/app/services/bd.service';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css']
})
export class MisTurnosComponent {

  usuarioActual : any;
  title = 'angular-text-search-highlight';
  searchText = '';
  characters = [
    'Ant-Man',
    'Aquaman',
    'Asterix',
    'The Atom',
    'The Avengers',
    'Batgirl',
    'Batman',
    'Batwoman'
  ];

  constructor(private bd : BdService, private bdFire : Firestore){}

  async ngOnInit()
  {
    this.bd.$getPacienteActivo.subscribe(data => this.usuarioActual = data);
  }
}
