import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { FormComponent } from './clientes/form.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { NotfoundComponent } from './notfound/notfound.component';

import { ClienteService } from './clientes/cliente.service';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from "@angular/common/http";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    NotfoundComponent,
    FormComponent,
    PaginatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SweetAlert2Module.forRoot(),
    ReactiveFormsModule
  ],
  providers: [ClienteService, {provide: LOCALE_ID, useValue: 'es' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
