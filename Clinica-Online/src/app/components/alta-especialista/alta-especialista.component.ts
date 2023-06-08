import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, addDoc, collection, doc, setDoc } from '@angular/fire/firestore';
import { StorageReference, getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification } from '@angular/fire/auth';

@Component({
  selector: 'app-alta-especialista',
  templateUrl: './alta-especialista.component.html',
  styleUrls: ['./alta-especialista.component.css']
})
export class AltaEspecialistaComponent {

  especialidad: string = '';
  imagen: string = '';
  usuarioRegistrado!:any;
  public formAltaEspecialista : FormGroup;

  constructor(private formBuilder: FormBuilder, private auth : Auth, private db : Firestore)
  {
    this.formAltaEspecialista = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      mail: ['', [Validators.required]],
      pass: ['', [Validators.required]],
      imgPerfil_1: ['', [Validators.required]],
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
              perfil: 'especialista',
              mail: this.formAltaEspecialista.value.mail,
              pass: this.formAltaEspecialista.value.pass,
              ImgPerfil_1: this.imagen
            }, {merge:true});
          })
        })

        setTimeout(() => {
          console.log(this.auth.currentUser);
        }, 1000);
      }
      else
      {
        console.log("falta validar campos");
      }
    }
    else
    {
      console.log("falta 1 o las 2 img");
    }
  }
}

