import { Injectable } from '@angular/core';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { Observable, of } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api';
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor( private http: HttpClient ) { }

  getClientes():Observable<Cliente[]> {
    
      return this.http.get( `${this.urlEndPoint}/clientes` ).pipe(
      map( response => response as Cliente[] )
    );

  }

  create(  cliente: Cliente ): Observable<Cliente> {
    return this.http.post<Cliente>( `${this.urlEndPoint}/clientes`, cliente, { headers: this.httpHeaders } );
  }

  getCliente( id: number ): Observable<Cliente> {
    return this.http.get<Cliente>( `${this.urlEndPoint}/clientes/${id}` );
  }


  updateCliente( cliente: Cliente ): Observable<Cliente>{
    return this.http.put<Cliente>( `${this.urlEndPoint}/clientes/${cliente.id}`, cliente, { headers: this.httpHeaders } );
  }

  delete( id: number ): Observable<Cliente> {

    return this.http.delete<Cliente>( `${this.urlEndPoint}/clientes/${id}`, { headers: this.httpHeaders }  )
  }



    /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
