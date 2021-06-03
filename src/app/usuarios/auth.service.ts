import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario';
import { LoginResponse } from './login-response.interface';
import { PayloadObj } from './payload-obj.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario;  
  
  private _token: string;
 
  
  constructor( private http: HttpClient ) { }

  public get usuario(): Usuario {
    if( this._usuario != null ){
      return this._usuario;

    }else if( this._usuario == null && sessionStorage.getItem('usuario') ){
       this._usuario = JSON.parse( sessionStorage.getItem('usuario') ) as Usuario;
       return this._usuario;
    }

    return new Usuario();
    
  }

  public get token(): string {
    if( this._token != null ){
      return this._token;

    }else if( this._token == null && sessionStorage.getItem('token') ){
       this._token =  sessionStorage.getItem('token');
       return this._token;
    }

    return null;
  }
  
  

  login( usuario: Usuario ):Observable<LoginResponse>{
    const urlEndpoint = 'http://localhost:8080/oauth/token';
    // fnc() para encriptar en base 64
    const credenciales = btoa('angularapp' + ':' + '12345');
    const httpHeaders = new HttpHeaders(
      {
       'Content-Type': 'application/x-www-form-urlencoded',
       'Authorization': 'Basic ' + credenciales
      }
    );

    let params = new URLSearchParams();
    params.set( 'username', usuario.username);
    params.set( 'password', usuario.password);
    params.set( 'grant_type', 'password');

    console.debug(params.toString());    
    return this.http.post<LoginResponse>( urlEndpoint, params.toString(), { headers: httpHeaders })

  }
  
  guardarUsuario(accessToken: string): void {
    let payloadObj = this.obtenerDatoToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.nombre = payloadObj.nombre;
    this._usuario.apellido = payloadObj.apellido;
    this._usuario.roles = payloadObj.authorities;
    this._usuario.email = payloadObj.email;
    this._usuario.username = payloadObj.user_name;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario) );
  }

  guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', this._token);
  }

  obtenerDatoToken( accessToken: string): PayloadObj {
    let payloadObj: PayloadObj;
    if( accessToken != null ){
      payloadObj = JSON.parse( atob( accessToken.split(".")[1] ) ) ;
      return payloadObj;
    }
    return null;

  }

  isAuthenticated(): boolean{
    let payLoad = this.obtenerDatoToken( this.token );
    
    if ( payLoad != null && payLoad.user_name && payLoad.user_name.length > 0 ){
     return true; 
    }
    
    return false;

  }

  logoout(): void{
    this._token = null;
    this._usuario = null;
    // sessionStorage.clear();
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
    

  }

  isHasRole( role:string ): boolean {
    if( this.usuario.roles.includes(role) ){
      return true;
    }

    return false;
  }

  

}
