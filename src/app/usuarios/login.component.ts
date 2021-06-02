import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Usuario } from './usuario';
import Swal2 from 'sweetalert2';
import { SuscriptionObjs } from '../model/classes/suscription-objs';
import { Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from "@angular/router";
import { PayloadObj } from './payload-obj.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  titulo: string = 'Por favor Sign in!'
  loginForm: FormGroup;
  usuario: Usuario;
  private subscriptionObj: SuscriptionObjs;
  private subscriptionArray: Subscription[];

  constructor( private authService: AuthService, private router: Router ) {
    this.usuario = new Usuario();
    this.inicializaFormulario();    
    
   }

   
   ngOnInit(): void {
     if( this.authService.isAuthenticated() ) {
       Swal2.fire({
         title: 'Login',
         text : `Hola ${this.authService.usuario.username} ya estas autenticado!`,
         icon: 'info'
       });
       this.router.navigate(['/clientes']);
     }
  }

  ngOnDestroy(): void {
    // this.subscriptionArray.forEach( (subscription) => {
    //   subscription.unsubscribe();
    // });
  }
  
  inicializaFormulario(){
    this.loginForm = new FormGroup({
      username: new FormControl('',[Validators.required]),
      password: new FormControl('',[ Validators.required ])
    });

    // suscripcion a valueChanges
    this.loginForm.get('username').valueChanges.subscribe( value => {
      this.usuario.username  = value;
    });
    this.loginForm.get('password').valueChanges.subscribe( value => {
      this.usuario.password  = value;
    });

    

  }
  
  login(){
    console.debug(this.usuario);
    if( this.usuario.username == null || this.usuario.password == null ) {
      Swal2.fire({
        title: 'Error Login',
        text: 'Username o Password vacias!',
        icon: 'error'
      });
      return;
    }

    this.authService.login( this.usuario ).subscribe( response => {
        console.debug(response);
        this.authService.guardarUsuario( response.access_token );
        this.authService.guardarToken( response.access_token );
  
        let usuario = this.authService.usuario;
  
        this.router.navigate(['/clientes']);
        Swal2.fire({
          title: 'Login',
          text: `Hola ${usuario.username}, has iniciado session con exito`,
          icon: 'success'
        });
      }, (error: HttpErrorResponse) => {
        console.debug(error);
        if(error.status == 400){
          Swal2.fire({
            title: 'Error Login',
            text: `Invalid user y/o password!`,
            icon: 'error'
          });
          
        }
      }
    );
  }
}

