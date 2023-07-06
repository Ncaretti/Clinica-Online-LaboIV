import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, addDoc, collection, doc, setDoc } from '@angular/fire/firestore';
import { StorageReference, getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from '@angular/fire/auth';
import { RecuperarAdminService } from 'src/app/services/recuperar-admin.service';
import { BdService } from 'src/app/services/bd.service';
import { Router } from '@angular/router';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

@Component({
  selector: 'app-alta-especialista',
  templateUrl: './alta-especialista.component.html',
  styleUrls: ['./alta-especialista.component.css']
})
export class AltaEspecialistaComponent {

  especialidad: string[] = [];
  imagen: string = '';
  usuarioRegistrado!:any;
  public formAltaEspecialista : FormGroup;
  especialidadesConcatenadas:string = '';
  captcha : string = '';

  ngOnInit(){
    this.captcha = this.generarCaptcha();
  }

  constructor(private mensaje : NotificacionesService ,private router : Router ,private bd : BdService ,private datosAdmin : RecuperarAdminService ,private formBuilder: FormBuilder, private auth : Auth, private db : Firestore)
  {
    this.formAltaEspecialista = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      mail: ['', [Validators.required]],
      pass: ['', [Validators.required]],
      imgPerfil_1: ['', [Validators.required]],
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
        this.imagen = url;
        console.log(this.imagen);
      })
    })
  }

  async altaEspecialista()
  {
    if(this.imagen != "")
    {
      if(this.formAltaEspecialista.valid)
      {
        if(this.captcha == this.formAltaEspecialista.value.captcha.toUpperCase())
        {
          console.log(this.formAltaEspecialista.value.mail);
          await createUserWithEmailAndPassword(this.auth, this.formAltaEspecialista.value.mail, this.formAltaEspecialista.value.pass)
          .then((data)=>{
            console.log(data.user.email);
            sendEmailVerification(data.user)
            .then(()=>{
              this.usuarioRegistrado = data.user;
  
              const ref = doc(this.db, 'usuarios', data.user.uid);
              console.log(data.user.uid);
              setDoc(ref, {
                nombre: this.formAltaEspecialista.value.nombre,
                apellido: this.formAltaEspecialista.value.apellido,
                edad: this.formAltaEspecialista.value.edad,
                dni: this.formAltaEspecialista.value.dni,
                especialidad: this.especialidad,
                estaAprobado: -1,
                perfil: 'especialista',
                mail: this.formAltaEspecialista.value.mail,
                pass: this.formAltaEspecialista.value.pass,
                ImgPerfil_1: this.imagen
              }, {merge:true});
  
              this.mensaje.alertas("Registro exitoso!", 'success');
              this.router.navigate(['/bienvenido']);
            })
          })
  
          if(this.datosAdmin.datosAdmin != ''){
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
            }, 1000);
          }
        }
        else
        {
          this.mensaje.alertas("Captcha invalido.", 'error');
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
      console.log("falta 1 o las 2 img");
    }
  }

  cargarEspecialidades(esp : string){
    for(let i = 0; i <= this.especialidad.length; i++)
    {
      if(!this.especialidad.includes(esp))
      {
        this.especialidad.push(esp);
        this.especialidadesConcatenadas += esp+', ';
      }
    }
    console.log(this.especialidad);
    console.log(this.especialidadesConcatenadas);
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

