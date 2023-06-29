import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, addDoc, collection, doc, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageReference, getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import { BdService } from 'src/app/services/bd.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { RecuperarAdminService } from 'src/app/services/recuperar-admin.service';

@Component({
  selector: 'app-alta-paciente',
  templateUrl: './alta-paciente.component.html',
  styleUrls: ['./alta-paciente.component.css']
})
export class AltaPacienteComponent {

  public formAltaPaciente : FormGroup;
  img1 : any = "";
  img2: any = "";
  usuarioRegistrado!: any;

  constructor(private mensaje : NotificacionesService, private router : Router ,private bd : BdService, private datosAdmin : RecuperarAdminService ,private formBuilder: FormBuilder, private db : Firestore, private auth : Auth)
  {
    this.formAltaPaciente = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      obraSocial: ['', [Validators.required]],
      mail: ['', [Validators.required]],
      pass: ['', [Validators.required]],
    })
  }

  async uploadImage($event: any, opcion: number) 
  {
    const file = $event.target.files[0];
    const path = 'img ' + Date.now() + Math.random() * 10;
    const storage = getStorage();
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file)
    .then(()=>{
      getDownloadURL(storageRef)
      .then((url)=>{
        if(opcion == 1)
        {
          this.img1 = url;
        }
        else{
          this.img2 = url;
        }
      })
    })
  }

  async altaPaciente()
  {
    if(this.img1 != "" && this.img2 != "")
    {
      if(this.formAltaPaciente.valid)
      {
        console.log(this.formAltaPaciente.value.mail);
        await createUserWithEmailAndPassword(this.auth, this.formAltaPaciente.value.mail, this.formAltaPaciente.value.pass)
        .then((data)=>{
          console.log(data.user.email);
          sendEmailVerification(data.user)
          .then(()=>{
            this.usuarioRegistrado = data.user;

            const ref = doc(this.db, 'usuarios', data.user.uid);
            console.log(data.user.uid);
            setDoc(ref, {
              nombre: this.formAltaPaciente.value.nombre,
              apellido: this.formAltaPaciente.value.apellido,
              edad: this.formAltaPaciente.value.edad,
              dni: this.formAltaPaciente.value.dni,
              obraSocial: this.formAltaPaciente.value.obraSocial,
              perfil: 'paciente',
              mail: this.formAltaPaciente.value.mail,
              pass: this.formAltaPaciente.value.pass,
              ImgPerfil_1: this.img1,
              ImgPerfil_2: this.img2,
            }, {merge:true});

            this.mensaje.alertas("Registro exitoso!", 'success');
            this.router.navigate(['/bienvenido']);
            //agregar sweetalert que todo salio ok
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
        this.mensaje.alertas("Complete/valide todos los campos.", 'error');
        console.log("falta validar campos");
      }
    }
    else
    {
      this.mensaje.alertas("Falta/n la/s imagen/es.", 'error');
      console.log("falta 1 o las 2 img");
    }
  }
}
