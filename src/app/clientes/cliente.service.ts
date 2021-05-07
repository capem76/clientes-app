import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, of, throwError } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import Swal from 'sweetalert2';

import { Router } from "@angular/router";



@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api';
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor( private http: HttpClient, private router: Router ) { }

  getClientes():Observable<Cliente[]> {
    
      return this.http.get( `${this.urlEndPoint}/clientes` ).pipe(
      map( response => response as Cliente[] ),
      catchError( e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire({          
          title: e.error.mensaje,
          text: e.error.error,
          icon: 'error'
        });
        return throwError(e);
      })
    );

  }

  create(  cliente: Cliente ): Observable<any> {
    return this.http.post<any>( `${this.urlEndPoint}/clientes`, cliente, { headers: this.httpHeaders } ).pipe(
      catchError(e => {      
        
        if( e.status === 400){
          return throwError( e );
        }
        
        console.error(`${e.error.mensaje}`);
        Swal.fire({          
          title: e.error.mensaje,
          text: e.error.error,
          icon: 'error'
        });
        return throwError(e);
      })
    );
  }

  getCliente( id: number ): Observable<Cliente> {
    return this.http.get( `${this.urlEndPoint}/clientes/${id}` ).pipe(
      map( ( response: any ) => response.cliente as Cliente ),
      catchError( e => {
        this.router.navigate(['/clientes']);
        console.error(`${e.error.mensaje}`);
        Swal.fire({
          title: `Error al obtener cliente ${id}`,
          titleText: `${e.error.mensaje}`,
          icon: 'error'
        });
        return throwError(e);
      })
    );
  }


  updateCliente( cliente: Cliente ): Observable<Cliente>{
    return this.http.put( `${this.urlEndPoint}/clientes/${cliente.id}`, cliente, { headers: this.httpHeaders } ).pipe(
      map( (response: any ) => response.cliente as Cliente ),
      catchError(e => {
        if( e.status === 400){
          return throwError( e );
        }      
         
        this.router.navigate(['/clientes']);
        
        console.error(`${e.error.mensaje}`);
        Swal.fire({          
          title: e.error.mensaje,
          text: e.error.error,
          icon: 'error'
        });
        return throwError(e);
      })
    );
  }

  delete( id: number ): Observable<Cliente> {

    return this.http.delete<any>( `${this.urlEndPoint}/clientes/${id}`, { headers: this.httpHeaders }  ).pipe(      
      catchError(e => {
        this.router.navigate((['/clientes']));
        console.error(e.error.mensaje);
        Swal.fire({          
          title: e.error.mensaje,
          text: e.error.error,
          icon: 'error'
        });
        return throwError(e);
      })
    );
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
