import { NgModule } from '@angular/core';
import { RouterModule, Routes  } from "@angular/router";
import { ClientesComponent } from './clientes/clientes.component';
import { FormComponent } from './clientes/form.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { NotfoundComponent } from './notfound/notfound.component';
import  "@angular/common/locales/global/es";
import { LoginComponent } from './usuarios/login.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';
import { DetalleFacturaComponent } from './facturas/detalle-factura.component';

const routes: Routes = [
  { path: '',  pathMatch: 'full', redirectTo: 'clientes' },  
  { path: 'directivas', component: DirectivaComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'clientes/page/:page', component: ClientesComponent },
  { path: 'clientes/form', component: FormComponent, canActivate:[ AuthGuard, RoleGuard ], data: {role: 'ROLE_ADMIN'} },
  { path: 'clientes/form/:id', component: FormComponent,  canActivate:[ AuthGuard, RoleGuard ], data: {role: 'ROLE_ADMIN'} },  
  { path: 'login', component: LoginComponent },
  { path: 'facturas/:id', component: DetalleFacturaComponent },
  { path: '404', component: NotfoundComponent  },
  { path: '**', redirectTo: '/404' }
];


@NgModule({  
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
