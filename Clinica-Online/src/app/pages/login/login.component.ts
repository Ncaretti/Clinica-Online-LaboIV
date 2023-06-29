import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BdService, Usuario } from 'src/app/services/bd.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email : any;
  pass : any
  usuarioActual!:any;
  arrayUsuarios: Usuario[] = [];
  show: boolean = false

  arrayAccesoRapido: any[] = [];
  
  constructor(private mensaje : NotificacionesService ,private auth : Auth, private router : Router, private bdService : BdService){}

  ngOnInit()
  {
    this.show = true;
    Promise.all([
      firstValueFrom(this.bdService.getUsuarios())
    ]).then(([usuarios]) =>{
      this.arrayUsuarios = usuarios;
      setTimeout(()=>{
        this.cargarUsuariosAccRapido();
        this.show = false;
      }, 500)
    });
  }

  login()
  {
    signInWithEmailAndPassword(this.auth, this.email, this.pass)
    .then((data)=>{
      if(!data.user.emailVerified)
      {
        this.mensaje.alertasLogin("Mail sin verificar.", "error", "Ok");
        console.log("Debe verificar el mail!!");
        this.auth.signOut;
      }
      else
      {
        this.arrayUsuarios.forEach((usuario: any) => {
          if(usuario.mail == this.email && usuario.pass == this.pass)
          {
            console.log(usuario);
            if(usuario.perfil == 'especialista' && usuario.estaAprobado == 1)
            {
              this.bdService.enviarPacienteActivo(usuario);
              this.router.navigate(['/bienvenido'])
              console.log("Mail verificado");
              console.log("Admin verifico");
              console.log(usuario);
              let user = usuario.nombre + " " + usuario.apellido;
              this.bdService.uploadLogIngreso({usuario: user ,fecha_ingreso: Date.now()})
            }
            else if(usuario.perfil != 'especialista')
            {
              this.bdService.enviarPacienteActivo(usuario);
              this.router.navigate(['/bienvenido'])
              console.log("Mail verificado");
              console.log("Admin verifico");
              console.log(usuario);
              let user = usuario.nombre + " " + usuario.apellido;
              this.bdService.uploadLogIngreso({usuario: user ,fecha_ingreso: Date.now()})
            }
            else
            {
              this.mensaje.alertasLogin("Especialista no aprobado.", "error", "Ok");
              console.log("No esta aprobado");
            }
          }
        });
      }
    })
    .catch((error)=>{
      this.mensaje.alertasAuth(error.code);
    })
  }

  cargarUsuariosAccRapido(){
    //admin
    this.bdService.getUsuario('s3fGenIkc2W9ORiwIpHZqij1m9X2')
    .then((user)=>{
      this.arrayAccesoRapido.push(user.data())
    })

    //esp 1
    this.bdService.getUsuario('yecvzR3ejVWo0lBjQLDJvwHhmAF2')
    .then((user)=>{
      this.arrayAccesoRapido.push(user.data())
    })

    //esp 2
    this.bdService.getUsuario('OPJO9JgAp7QehZLSWjMaIHETZcn1')
    .then((user)=>{
      this.arrayAccesoRapido.push(user.data())
    })

    //pac 1
    this.bdService.getUsuario('TVY9rpXtjKdunCs9lROk9ZTM4lh2')
    .then((user)=>{
      this.arrayAccesoRapido.push(user.data())
    })

    //pac 2
    this.bdService.getUsuario('HYDeXW5MpvXOe9psl0Whkewsm6o2')
    .then((user)=>{
      this.arrayAccesoRapido.push(user.data())
    })

    //pac 3
    this.bdService.getUsuario('EuThQeCER1Xfl7DBjZD92rwdv2v2')
    .then((user)=>{
      this.arrayAccesoRapido.push(user.data())
    })

    setTimeout(()=>{
      console.log(this.arrayAccesoRapido);
    }, 300)
  }

  cargarUserPass(user : Usuario)
  {
    this.email = user.mail;
    this.pass = user.pass;
  }
}
