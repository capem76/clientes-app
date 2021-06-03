import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import Swal2 from 'sweetalert2';
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor( private authService: AuthService, private router: Router ){

  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

     catchError( e => {
      if ( e.status == 401 ){
        if( this.authService.isAuthenticated() ) {
          this.authService.logoout();
        }
        this.router.navigate(['/login']);
      }
  
      if ( e.status == 403 ){
        Swal2.fire({
          title: 'No Autorizado',
          text: `Hola ${this.authService.usuario.username}, no tiene permisos para esa accion!`,
          icon: 'warning'
        });
        this.router.navigate(['/clientes']);
      }
      
      return throwError(e);

     });



    return next.handle(req).pipe();
  }
}