import { Component } from '@angular/core';
import { BdService } from 'src/app/services/bd.service';

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent {

  arrayUsuarios!:any;

  constructor(private bdService : BdService){}

  ngOnInit(){
    this.bdService.getUsuarios().subscribe(data => this.arrayUsuarios = data);
    // this.bdService.getEspecialistas().subscribe(data => this.arrayEspecialistas = data);
  }
}
