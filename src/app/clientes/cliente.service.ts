import { Injectable } from '@angular/core';
import { DatePipe } from "@angular/common";
// import { Cliente } from './cliente';
import { Observable, of, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import Swal from 'sweetalert2';

import { Router } from "@angular/router";
import { PageCliente } from '../model/interfaces/page-cliente';
import { Cliente } from '../model/interfaces/cliente';
import { Region } from './region';





@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private _urlEndPoint: string = 'http://localhost:8080/api/clientes';   
  private _uriNoFoto: string = "http://localhost:8080/images/no-user-3.png";
  
  constructor( private http: HttpClient, private router: Router ) { }

    
  public get urlEndPoint(): string {
    return this._urlEndPoint;
  }
  public set urlEndPoint(value: string) {
    this._urlEndPoint = value;
  }
  
  public get uriNoFoto(): string {
    return this._uriNoFoto;
  }
  public set uriNoFoto(value: string) {
    this._uriNoFoto = value;
  }


  getRegiones(): Observable<Region[]>{
    
    return this.http.get<Region[]>(`${this.urlEndPoint}/regiones`);

  }

  getClientes( page: number):Observable<PageCliente> {
    
      return this.http.get( `${this.urlEndPoint}/page/${page}` ).pipe(

        tap( (pageCliente: PageCliente) => {
          console.log("ClienteService: tap 1");
          pageCliente.content.forEach( cliente => {
            let datePipe = new DatePipe('es');            
            console.log(`nombre cliente: ${cliente.nombre} creado el: ${datePipe.transform(cliente.createAt, 'fullDate')}`);            
          });
        }),
        map( (pageCliente: PageCliente) =>{   
          pageCliente.content.map( cliente => {
            cliente.nombre = cliente.nombre.toUpperCase();
            // let datePipe = new DatePipe('es');
            // cliente.createAt = datePipe.transform( cliente.createAt, 'EEEE dd, MMMM yyyy' );
            // cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');
            return cliente;
          });
          return pageCliente;  
         }),
         tap( pageCliente => {          
          console.log("ClienteService: tap 2");
                    
           pageCliente.content.forEach( cliente => {
              let datePipe = new DatePipe('es');            
              console.log(`nombre cliente: ${cliente.nombre} creado el: ${datePipe.transform(cliente.createAt, 'fullDate')}`);            
          });
        }),
        catchError( e => {
          this.router.navigate(['/clientes']);
          if( e.error.mensaje)
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

  create(  cliente: Cliente ): Observable<any> {
    return this.http.post<any>( `${this.urlEndPoint}`, cliente ).pipe(
      catchError(e => {      
               
        if( e.status === 400){
          return throwError( e );
        }        
        if( e.error.mensaje)
          console.error(`${e.error.mensaje}`);       
        return throwError(e);
      })
    );
  }

  getCliente( id: number ): Observable<Cliente> {
    return this.http.get( `${this.urlEndPoint}/${id}` ).pipe(
      map( ( response: any ) => response.cliente as Cliente ),
      catchError( e => {  
        if(e.status != 401 && e.error.mensaje){
          this.router.navigate(['/clientes']);
          console.error(`${e.error.mensaje}`);
        }   
        return throwError(e);
      })
    );
  }


  updateCliente( cliente: Cliente ): Observable<Cliente>{
    return this.http.put( `${this.urlEndPoint}/${cliente.id}`, cliente ).pipe(
      map( (response: any ) => response.cliente as Cliente ),
      catchError(e => {
        if( e.status === 400){
          return throwError( e );
        }      
         
        this.router.navigate(['/clientes']);
        return throwError(e);
      })
    );
  }

  delete( id: number ): Observable<Cliente> {

    return this.http.delete<any>( `${this.urlEndPoint}/${id}`  ).pipe(      
      catchError(e => {
        this.router.navigate((['/clientes']));
        if( e.error.mensaje)
          console.error(`${e.error.mensaje}`);       
        return throwError(e);
      })
    );
  }


  subirFoto( archivo: File, id: number): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id.toString() );
    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {      
      reportProgress: true
    });
    
    return this.http.request(req);
    
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
