import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BdService } from 'src/app/services/bd.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email : any;
  pass : any
  usuarioActual!:any;
  arrayUsuarios!:any;
  
  constructor(private auth : Auth, private router : Router, private bdService : BdService){}

  ngOnInit()
  {
    Promise.all([
      firstValueFrom(this.bdService.getUsuarios())
    ]).then(([usuarios]) =>{
      this.arrayUsuarios = usuarios;
    })
  }

  login()
  {
    signInWithEmailAndPassword(this.auth, this.email, this.pass)
    .then((data)=>{
      if(!data.user.emailVerified)
      {
        console.log("Deben verificar el mail!!");
        this.auth.signOut;
      }
      else
      {
        this.arrayUsuarios.forEach((usuario: any) => {
          if(usuario.mail == this.email && usuario.pass == this.pass)
          {
            this.bdService.enviarPacienteActivo(usuario);
            this.router.navigate(['/bienvenido'])
            console.log("Mail verificado");
            console.log(usuario);
          }
        });
      }
    })
  }

  usuariosPrecargados(opcion: number) {
    switch (opcion) {
      case 1:
          this.email = 'admin@mailna.co';
          this.pass = 'asd123';
      break;
      case 2:
          this.email = 'especialista@mailna.co';
          this.pass = 'asd123';
      break;
      case 3:
          this.email = 'nowohay914@onlcool.com';
          this.pass = 'asd123';
      break;
    }
  } 
}
