import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BdService } from 'src/app/services/bd.service';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent {

  usuarioActivo!:any;
  constructor(private router : Router, private bdService : BdService, private authBd : Auth){

  }

  ngOnInit()
  {
    console.log(this.bdService.$getPacienteActivo);
    console.log(this.authBd.currentUser);
    this.bdService.$getPacienteActivo.subscribe(data => this.usuarioActivo = data);
    console.log(this.usuarioActivo.perfil);
  }

  irLogin(){
    this.router.navigate(['/login']);
  }

  irRegistrar(){
    this.router.navigate(['/registro']);
  }
}
