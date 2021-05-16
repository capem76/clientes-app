import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
import Swal2 from "sweetalert2";

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  cliente: Cliente;
  titulo:string = "Detalle del cliente";
  private _fotoSeleccionada: File;
  
  constructor( private clienteService: ClienteService, 
    private activatedRoute: ActivatedRoute  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( params => {
      let id: number = +params.get('id');
      if ( id ) {
        this.clienteService.getCliente(id).subscribe( cliente => {
          this.cliente = cliente;
        });
      }

    });
  }

  public get fotoSeleccionada(): File {
    return this._fotoSeleccionada;
  }
  public set fotoSeleccionada(value: File) {
    this._fotoSeleccionada = value;
  }

  seleccionarFoto(event: File[]){

    this.fotoSeleccionada = event[0];
    console.log( this.fotoSeleccionada );

  }

  subirFoto(){

    this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
      .subscribe( cliente => {
        this.cliente = cliente;
        Swal2.fire({          
          title: "Subir Imagen",
          text: `La imagen ${this.cliente.foto} ha sido almacenada correctamente`,
          icon: 'success'
        });
      });

  }

}
