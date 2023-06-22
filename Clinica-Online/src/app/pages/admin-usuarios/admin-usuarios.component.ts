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

  perfil(usr : any)
  {
    console.log(usr);
  }

  habilitarEspecialista(usr : any){
    this.bdService.habilitarEstadoEsp(usr.id);
  }

  deshabilitarEspecialista(usr : any){
    this.bdService.deshabilitarEstadoEsp(usr.id);
  }
}
