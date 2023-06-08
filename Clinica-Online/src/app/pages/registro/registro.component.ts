import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  eleccion : string = "ninguno";
  public formAltaEspecialista : FormGroup;

  constructor(private formBuilder: FormBuilder)
  {
    this.formAltaEspecialista = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      mail: ['', [Validators.required]],
      pass: ['', [Validators.required]],
      imgPerfil: ['', [Validators.required]],
    })
  }


}
