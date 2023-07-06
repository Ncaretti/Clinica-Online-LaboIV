import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageReference, getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import { BdService } from 'src/app/services/bd.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { RecuperarAdminService } from 'src/app/services/recuperar-admin.service';

@Component({
  selector: 'app-alta-admin',
  templateUrl: './alta-admin.component.html',
  styleUrls: ['./alta-admin.component.css']
})
export class AltaAdminComponent {
  
  public formAltaAdmin : FormGroup;
  imgPerfil : any = "";
  usuarioRegistrado!: any;
  captcha: string = '';

  ngOnInit(){
    this.captcha = this.generarCaptcha();
  }

  constructor(private mensaje : NotificacionesService, private bd : BdService ,private datosAdmin : RecuperarAdminService ,private auth : Auth ,private router : Router ,private formBuilder: FormBuilder, private authFire : Auth, private db : Firestore)
  {
    this.formAltaAdmin = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required]],
      mail: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      pass: ['', [Validators.required]],
      captcha: ['', [Validators.required]]
    })
  }

  async uploadImage($event: any) 
  {
    const file = $event.target.files[0];
    const path = 'img ' + Date.now() + Math.random() * 10;
    const storage = getStorage();
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file)
    .then(()=>{
      getDownloadURL(storageRef)
      .then((url)=>{
        this.imgPerfil = url;
      })
    })
  }

  async altaAdmin()
  {
    if(this.imgPerfil != "")
    {
      if(this.formAltaAdmin.valid)
      {
        console.log(this.formAltaAdmin.value.mail);
        await createUserWithEmailAndPassword(this.authFire, this.formAltaAdmin.value.mail, this.formAltaAdmin.value.pass)
        .then((data)=>{
          console.log(data.user.email);
          sendEmailVerification(data.user)
          .then(()=>{
            this.usuarioRegistrado = data.user;
            console.log()
            const ref = doc(this.db, 'usuarios', data.user.uid);
            console.log(data.user.uid);
            setDoc(ref, {
              nombre: this.formAltaAdmin.value.nombre,
              apellido: this.formAltaAdmin.value.apellido,
              edad: this.formAltaAdmin.value.edad,
              dni: this.formAltaAdmin.value.dni,
              perfil: 'admin',
              mail: this.formAltaAdmin.value.mail,
              pass: this.formAltaAdmin.value.pass,
              ImgPerfil_1: this.imgPerfil,
            }, {merge:true});
            //agregar sweetalert que todo salio ok
            this.mensaje.alertas("Registro exitoso!", 'success');
          })
        })

        if(this.datosAdmin.datosAdmin != '')
        {
          setTimeout(() => {
            console.log(this.auth.currentUser);
            this.auth.signOut()
            .then(()=>{
              signInWithEmailAndPassword(this.auth, this.datosAdmin.datosAdmin.mail, this.datosAdmin.datosAdmin.pass)
              .then((usr)=>{
                this.bd.getUsuario(usr.user.uid);
                console.log(this.auth.currentUser);
                this.router.navigate(['/admin-user'])
              })
            })
          }, 1500);
        }
      }
      else
      {
        this.mensaje.alertas("Complete/valide todos los campos.", 'error');
        console.log("falta validar campos");
      }
    }
    else
    {
      this.mensaje.alertas("Falta imagen.", 'error');
      console.log("falta la img");
    }
  }

  generarCaptcha() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let retorno = '';

    for (let i = 0; i < 6; i++) {
      retorno += caracteres.charAt(
        Math.floor(Math.random() * caracteres.length)
      );
    }
    return retorno;
  }

}
