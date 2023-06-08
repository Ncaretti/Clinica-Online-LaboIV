import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification } from '@angular/fire/auth';
import { Firestore, addDoc, collection, doc, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageReference, getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';

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

  constructor(private formBuilder: FormBuilder, private db : Firestore, private auth : Auth)
  {
    this.formAltaPaciente = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      obraSocial: ['', [Validators.required]],
      mail: ['', [Validators.required]],
      pass: ['', [Validators.required]],
      // imgPerfil1: ['', [Validators.required]],
      // imgPerfil2: ['', [Validators.required]]
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
