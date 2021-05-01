import { NgModule } from '@angular/core';
import { RouterModule, Routes  } from "@angular/router";
import { ClientesComponent } from './clientes/clientes.component';
import { FormComponent } from './clientes/form.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { NotfoundComponent } from './notfound/notfound.component';

const routes: Routes = [
  { path: '',  pathMatch: 'full', redirectTo: 'clientes' },  
  { path: 'directivas', component: DirectivaComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'clientes/form', component: FormComponent },
  { path: '404', component: NotfoundComponent  },
  { path: '**', redirectTo: '/404' }
];


@NgModule({  
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }