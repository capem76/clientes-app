import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { PayloadObj } from '../payload-obj.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
     private authService: AuthService,
     private router: Router    ){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if( this.authService.isAuthenticated() ){
        if( this.isTokenExpirado() ){
          this.authService.logoout();
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }
      this.router.navigate(['/login']);
    return false;
  }

  isTokenExpirado(): boolean{
    let token: string = this.authService.token;
    let payload: PayloadObj = this.authService.obtenerDatoToken(token);
    let now = new Date().getTime() / 1000;
    if( payload.exp < now){
      return true;
    }

    return false;
  }
  
}
