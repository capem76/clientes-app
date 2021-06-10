import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  titulo: string = 'Nueva Factura';
  factura: Factura = new Factura();

  constructor( 
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute
    
  ) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe( params => {
      let clienteId: number = Number.parseInt(params.get('clienteId') );
      this.clienteService.getCliente( clienteId ).subscribe( cliente => {
        this.factura.cliente = cliente;
      });

    })

  }

}
