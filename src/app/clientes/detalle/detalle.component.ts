import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import Swal2 from "sweetalert2";
import { HttpEventType } from '@angular/common/http';
import { ClienteResponse } from 'src/app/model/interfaces/cliente-response';
import { ModalService } from './modal.service';
import { AuthService } from '../../usuarios/auth.service';
import { FacturaService } from '../../facturas/services/factura.service';
import { Factura } from '../../facturas/models/factura';


@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit, OnChanges {

  @Input() cliente: Cliente;
  titulo:string = "Detalle del cliente";
  private _fotoSeleccionada: File;
  private _uriEndPointFoto: string;
  progreso: number = 0;
  
  

  
  constructor( 
    private clienteService: ClienteService,     
    private modalService: ModalService,
    private authService: AuthService,
    private facturaService: FacturaService  ) {    
      
  }

  private swalWithBootstrapButtons = Swal2.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
  

  public get uriEndPointFoto(): string {      

    if(this.cliente.foto)
      this._uriEndPointFoto = `${this.clienteService.urlEndPoint}/uploads/img/${this.cliente.foto}`;
    else
      this._uriEndPointFoto = "";      

    return this._uriEndPointFoto;
  }

    
  
  ngOnInit(): void {
    
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
            console.debug(this.cliente);
            this.modalService.notificarUpload.emit(this.cliente);
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

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  isModalActive(): boolean{
    return this.modalService.modal;

  }
  

  isHasRole( role: string ): boolean{

    return this.authService.isHasRole(role);
  }

  deleteFactura( factura: Factura ): void{   
    console.debug(factura);
    this.swalWithBootstrapButtons.fire({
      title: 'Estas seguro?',
      text: `Sesguro de eliminar factura ${factura.descripcion}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Borrar!',
      cancelButtonText: 'Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.facturaService.delete(factura.id).subscribe( () => {    
          this.cliente.facturas = this.cliente.facturas.filter( f => f !== factura );             
          this.swalWithBootstrapButtons.fire(
            `factura eliminada!`,
            `factura ${factura.descripcion} eliminado con exito.`,
            'success'
          );

        })
      }

    })
    
  }

}
