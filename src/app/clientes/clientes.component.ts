import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from "sweetalert2";


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];

  private swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
  

  constructor( private clienteService: ClienteService ) { }

  ngOnInit(): void {
    this.clienteService.getClientes().subscribe(
      clientes => {
        this.clientes = clientes;
      } 
    );
  }

  deleteCliente( cliente: Cliente ): void {

    console.log(cliente);
    

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




}
