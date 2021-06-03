import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import Sw2 from 'sweetalert2';
import Swal2 from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if( !this.authService.isAuthenticated() ){
        this.router.navigate(['/login']);
        return false;
      }

      let role = route.data['role'] as string;
      console.debug(role);
      if(this.authService.isHasRole( role )){
        return true;
      }

      Swal2.fire({
        title: 'Acceso denegado',
        text: `Hola ${this.authService.usuario.username} no tienes acceso para este recurso `,
        icon: 'warning'
       }).then( result => {
          this.router.navigate(['/clientes']);         
       });
       
    return false;
  }
  
}
