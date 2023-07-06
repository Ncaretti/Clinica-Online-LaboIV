import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AltaEspecialistaComponent } from './components/alta-especialista/alta-especialista.component';
import { AltaPacienteComponent } from './components/alta-paciente/alta-paciente.component';
import { AdminUsuariosComponent } from './pages/admin-usuarios/admin-usuarios.component';
import { AltaAdminComponent } from './components/alta-admin/alta-admin.component';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { TurnosPacienteComponent } from './components/turnos-paciente/turnos-paciente.component';
import { TurnosEspecialistaComponent } from './components/turnos-especialista/turnos-especialista.component';
import { TurnosAdminComponent } from './components/turnos-admin/turnos-admin.component';
import { BuscadorPipe } from './pipes/buscador.pipe';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InformesComponent } from './pages/informes/informes.component';
import { TextoMayusculaDirective } from './directives/texto-mayuscula.directive';
import { FechaSolicitarTurnoPipe } from './pipes/fecha-solicitar-turno.pipe';
import { FechaTurnosPipe } from './pipes/fecha-turnos.pipe';
import { DestacarBotonDirective } from './directives/destacar-boton.directive';
import { FuenteBoldDirective } from './directives/fuente-bold.directive';
import { DestacarDirective } from './directives/destacar.directive';

@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    LoginComponent,
    RegistroComponent,
    AltaEspecialistaComponent,
    AltaPacienteComponent,
    AdminUsuariosComponent,
    AltaAdminComponent,
    SolicitarTurnoComponent,
    MisTurnosComponent,
    MiPerfilComponent,
    TurnosPacienteComponent,
    TurnosEspecialistaComponent,
    TurnosAdminComponent,
    BuscadorPipe,
    PacientesComponent,
    UsuariosComponent,
    InformesComponent,
    TextoMayusculaDirective,
    FechaSolicitarTurnoPipe,
    FechaTurnosPipe,
    DestacarBotonDirective,
    FuenteBoldDirective,
    DestacarDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
