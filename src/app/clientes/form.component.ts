import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from "sweetalert2";
import { NgForm } from '@angular/forms';

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

  create( clienteForm: NgForm ): void{

       
    console.log(`valor apellido: ${clienteForm.controls.apellido.value} \n 
      nombre: ${clienteForm.controls.nombre.value} \n email: ${clienteForm.controls.email.value}` );    
    
    this.clienteService.create( this.cliente )
      .subscribe(
        json => {    
          this.router.navigate(['/clientes']);
          Swal.fire({
            title: 'Nuevo Cliente',
            text: `${json.mensaje}: ${json.cliente.nombre}`,
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

  onSubmit( clienteForm: NgForm ): void{
    console.log(clienteForm);
    

  }

  

}
