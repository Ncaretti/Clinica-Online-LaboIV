import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { AdminUsuariosComponent } from './pages/admin-usuarios/admin-usuarios.component';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { InformesComponent } from './pages/informes/informes.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const routes: Routes = [
  {path: 'bienvenido', component: BienvenidaComponent, data: { animation: 'Home' }},
  {path: '', component: BienvenidaComponent},
  {path: 'login', component: LoginComponent, data: { animation: 'Login' }},
  {path: 'registro', component: RegistroComponent, data: { animation: 'Login' } },
  {path: 'admin-user', component: AdminUsuariosComponent, ...canActivate(()=> redirectUnauthorizedTo(['/bienvenido']))}, 
  {path: 'solicitar-turno', component: SolicitarTurnoComponent, ...canActivate(()=> redirectUnauthorizedTo(['/bienvenido']))},
  {path: 'mis-turnos', component: MisTurnosComponent, ...canActivate(()=> redirectUnauthorizedTo(['/bienvenido']))},
  {path: 'mi-perfil', component: MiPerfilComponent, ...canActivate(()=> redirectUnauthorizedTo(['/bienvenido']))},
  {path: 'pacientes', component: PacientesComponent, ...canActivate(()=> redirectUnauthorizedTo(['/bienvenido']))},
  {path: 'usuarios', component: UsuariosComponent, ...canActivate(()=> redirectUnauthorizedTo(['/bienvenido']))},
  {path: 'informes', component: InformesComponent, ...canActivate(()=> redirectUnauthorizedTo(['/bienvenido']))}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
