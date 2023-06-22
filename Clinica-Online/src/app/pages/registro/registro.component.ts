import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { BdService } from 'src/app/services/bd.service';
import { RecuperarAdminService } from 'src/app/services/recuperar-admin.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  eleccion : string = "ninguno";
  usuarioActual!:any;

  constructor(private datosAdmin : RecuperarAdminService ,private bd : BdService, private formBuilder: FormBuilder, private authFire : Auth, private auth : AuthService)
  {
  }

  ngOnInit()
  {
    this.bd.getUsuario(this.auth.getUid()!)
    .then((rsp) =>{
      this.usuarioActual = rsp.data();
      if(this.usuarioActual.perfil == 'admin')
      {
        this.datosAdmin.datosAdmin = this.usuarioActual;
        console.log("ES ADMIN");
      }
    })
    .catch(error => console.log(error));
  }

}
