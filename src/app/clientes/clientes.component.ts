import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from "sweetalert2";
import { tap } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { PageCliente } from '../model/interfaces/page-cliente';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  pagesClientes: PageCliente;

  private swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
  

  constructor( private clienteService: ClienteService,
      private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {
    this.obtenerClientesInicio();
   
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
          console.log('clienteService: tap 3')
          pageCliente.content.forEach(cliente => {
            console.log(cliente.nombre);
          })
        })
      ).subscribe(pagesClientes => {
        this.clientes = pagesClientes.content;
        this.pagesClientes = pagesClientes;
      });
    })

  }




}
