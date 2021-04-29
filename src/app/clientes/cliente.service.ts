import { Injectable } from '@angular/core';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api';

  constructor( private http: HttpClient ) { }

  getClientes():Observable<Cliente[]> {
    
    // return this.http.get<Cliente[]>( `${this.urlEndPoint}/clientes` ); /*** casteando la respuesta a tipo Cliente */

    /**
     * utilizando el operador map de rxjs
     */

    return this.http.get( `${this.urlEndPoint}/clientes` ).pipe(
      map( response => response as Cliente[] )
    );

  }

}
