import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
import Swal2 from "sweetalert2";
import { HttpEventType } from '@angular/common/http';
import { ClienteResponse } from 'src/app/model/interfaces/cliente-response';
import { timeInterval } from 'rxjs/operators';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit, OnChanges {

  cliente: Cliente;
  titulo:string = "Detalle del cliente";
  private _fotoSeleccionada: File;
  private _uriEndPointFoto: string;
  progreso: number = 0;
  
  

  
  constructor( private clienteService: ClienteService, 
    private activatedRoute: ActivatedRoute  ) {     
      
  }

  public get uriEndPointFoto(): string {
    return this._uriEndPointFoto;
  }
  public set uriEndPointFoto(value: string) {
    this._uriEndPointFoto = value;
  }
  
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( params => {
      let id: number = +params.get('id');
      if ( id ) {
        this.clienteService.getCliente(id).subscribe( cliente => {
          this.cliente = cliente;
          this.uriEndPointFoto = `${this.clienteService.urlEndPoint}/uploads/img/`;
        });
      }

    });
  }

  ngOnChanges(changes: SimpleChanges): void {    
  }


  public get fotoSeleccionada(): File {
    return this._fotoSeleccionada;
  }
  public set fotoSeleccionada(value: File) {
    this._fotoSeleccionada = value;
  }

  seleccionarFoto(event: File[]){
    this.fotoSeleccionada = event[0];    
    this.progreso = 0;
    this.validacionFicheros();    

  }

  subirFoto(){
    
    this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
      .subscribe( event => {        
          if ( event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round( (event.loaded/event.total) *100 );
          }else if( event.type === HttpEventType.Response ){
            let response: ClienteResponse = event.body as ClienteResponse;
            this.cliente = response.cliente;
            Swal2.fire({          
              title: "La imagen ha sido almacenada correctamente",
              text: response.mensaje,
              icon: 'success'
            });
  
          }
        // this.cliente = cliente;                
      });

  }

  textoLabel(): string {
    if( this.fotoSeleccionada )
      return this.fotoSeleccionada.name;
    else
      return "Buscar foto...";
  }

  private validacionFicheros(){        
    var arhivoPermitidos: string[] = ["image/jpeg", "image/png"];
    var fileName = this.fotoSeleccionada?.name;
    var fileSize = this.fotoSeleccionada?.size;

    if ((fileSize > 1024e4)) {
      console.error("tamaño fichero: " + (fileSize/1024) + "MB" );      
      Swal2.fire({          
        title: "Fichero muy grande",
        text: "tamaño fichero sobrepasa los 10MB permitidos" ,
        icon: 'error'
      });
      this.fotoSeleccionada = null;
      
      
    }

    if ( this.fotoSeleccionada?.type.indexOf('image') < 0 ) {
      console.error("error fichero no es de tipo imagen");
      this.fotoSeleccionada = null;
      Swal2.fire({          
        title: "Fichero no valido!",
        text: "Solo se permiten formatos de imagen" ,
        icon: 'error'
      });
    }


  }

}
