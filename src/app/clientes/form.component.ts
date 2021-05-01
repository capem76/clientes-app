import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
               private router: Router ) { }

  ngOnInit(): void {
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

}
