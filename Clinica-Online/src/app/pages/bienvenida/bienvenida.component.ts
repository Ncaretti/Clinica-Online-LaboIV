import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BdService } from 'src/app/services/bd.service';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent {

  usuarioActivo!:any;
  constructor(private router : Router, private bdService : BdService){

  }

  ngOnInit()
  {
    this.bdService.$getPacienteActivo.subscribe(data => this.usuarioActivo = data);
  }

  irLogin(){
    this.router.navigate(['/login']);
  }

  irRegistrar(){
    this.router.navigate(['/registro']);
  }
}
