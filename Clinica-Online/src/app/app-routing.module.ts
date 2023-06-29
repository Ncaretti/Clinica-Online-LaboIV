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

const routes: Routes = [
  {path: 'bienvenido', component: BienvenidaComponent, data: { animation: 'Home' }},
  {path: '', component: BienvenidaComponent},
  {path: 'login', component: LoginComponent, data: { animation: 'Login' }},
  {path: 'registro', component: RegistroComponent, data: { animation: 'Login' } },
  {path: 'admin-user', component: AdminUsuariosComponent},
  {path: 'solicitar-turno', component: SolicitarTurnoComponent},
  {path: 'mis-turnos', component: MisTurnosComponent},
  {path: 'mi-perfil', component: MiPerfilComponent},
  {path: 'pacientes', component: PacientesComponent},
  {path: 'usuarios', component: UsuariosComponent},
  {path: 'informes', component: InformesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
