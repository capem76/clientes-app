import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from "sweetalert2";
import { tap } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { PageCliente } from '../model/interfaces/page-cliente';
import { ModalService } from './detalle/modal.service';
import { Region } from './region';
import { AuthService } from '../usuarios/auth.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  pagesClientes: PageCliente;
  clienteSeleccionado: Cliente;
  uriFotoCliente: string;
  uriFotoNoCliente: string;
  regiones: Region[];



  private swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
  

  constructor( 
      private clienteService: ClienteService,
      private activatedRoute: ActivatedRoute,
      private modalService: ModalService,
      private authService: AuthService  ) { 

        this.uriFotoCliente = `${this.clienteService.urlEndPoint}/uploads/img/`;
        this.uriFotoNoCliente = this.clienteService.uriNoFoto;
        
      }

  ngOnInit(): void {
    this.obtenerClientesInicio();

    this.modalService.notificarUpload.subscribe( (cliente:Cliente) =>{
      this.clientes = this.clientes.map( clienteOriginal => {
        var i : number = i++;        
        if( cliente.id == clienteOriginal.id ){
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      })
    });
   
  }

  deleteCliente( cliente: Cliente ): void {
    this.swalWithBootstrapButtons.fire({
      title: 'Estas seguro?',
      text: `Sesguro de eliminar al cliente ${cliente.nombre} ${cliente.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Borrar!',
      cancelButtonText: 'Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe( response => {
          this.clientes = this.clientes.filter( cli => cli !== cliente);
          this.swalWithBootstrapButtons.fire(
            `Cliente eliminado!`,
            `Cliente ${cliente.nombre} ${cliente.apellido} eliminado con exito.`,
            'success'
          );

        })
      }

    })

  }

  private obtenerClientesInicio() {

    this.activatedRoute.paramMap.subscribe(params => {

      let page: number = Number.parseInt(params.get('page'));
      if (!page) {
        page = 0;
      }
      this.clienteService.getClientes(page).pipe(
        tap(pageCliente => {
          console.debug('clienteService: tap 3')
          pageCliente.content.forEach(cliente => {
            console.debug(cliente.nombre);
          })
        })
      ).subscribe(pagesClientes => {
        this.clientes = pagesClientes.content;
        this.pagesClientes = pagesClientes;        
      });
    })

  }

  private obtenerRegionesInicio(){
    
  }

  abrirModal( cliente: Cliente ){
    console.info(cliente);
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
    
  }

  isHasRole(role: string): boolean {
    return this.authService.isHasRole(role);
  }

  


}
