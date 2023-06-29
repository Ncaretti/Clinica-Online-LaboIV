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
  show : boolean = false;
  esAdmin!: boolean;

  constructor(private datosAdmin : RecuperarAdminService ,private bd : BdService, private formBuilder: FormBuilder, private authFire : Auth, private auth : AuthService)
  {
  }

  ngOnInit()
  {
    this.show = true;
    console.log(this.authFire.currentUser);
    if(this.authFire.currentUser != null)
    {
      // this.show = true;
      this.bd.getUsuario(this.auth.getUid()!)
      .then((rsp) =>{
        this.usuarioActual = rsp.data();
        if(this.usuarioActual.perfil == 'admin')
        {
          this.datosAdmin.datosAdmin = this.usuarioActual;
          console.log("ES ADMIN");
          this.esAdmin = true;
        }
        this.show = false;
      })
      .catch(error => console.log(error));
    }
    else{
      this.esAdmin = false;
      this.show = false;
    }
  }

}
