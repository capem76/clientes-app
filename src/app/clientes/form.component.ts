import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  titulo: string = "Formulario crear Cliente";
  cliente: Cliente = new Cliente();

  constructor( private clienteService: ClienteService,
               private router: Router,
               private activedRoute: ActivatedRoute ) { }

  ngOnInit(): void {
    this.cargarCliente();
  }

  create(): void{
    
    this.clienteService.create( this.cliente )
      .subscribe(
        cliente => {    
          this.router.navigate(['/clientes']);
          Swal.fire({
            title: 'Nuevo Cliente',
            text: `Cliente ${cliente.nombre}`,
            icon: 'success'
            
          });
        }
      );
        
  }

  cargarCliente(): void{
    this.activedRoute.params.subscribe( params => {
      let id = params[ 'id' ];
      if ( id ) {
        this.clienteService.getCliente( id ).subscribe( (cliente) => this.cliente = cliente );        
      }
    })
  }

  updateCliente(): void {
    this.clienteService.updateCliente( this.cliente )
      .subscribe( cliente => {
        this.router.navigate(['/clientes']);
        Swal.fire({
          title: 'Cliente actualizado',
          text: `Cliente ${cliente.nombre} actualizado con exito!`,
          icon: 'success'
          
        });
      })
  }

}
