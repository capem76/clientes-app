import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';
import { ActivatedRoute } from "@angular/router";
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, flatMap, mergeMap } from 'rxjs/operators';
import { FacturaService } from './services/factura.service';
import { Producto } from './models/producto';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  titulo: string = 'Nueva Factura';
  factura: Factura = new Factura();
  autoCompleteControl = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor( 
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private facturaService: FacturaService
    
  ) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe( params => {
      let clienteId: number = Number.parseInt(params.get('clienteId') );
      this.clienteService.getCliente( clienteId ).subscribe( cliente => {
        this.factura.cliente = cliente;
      });

    });

    this.productosFiltrados = this.autoCompleteControl.valueChanges
    .pipe(        
      map( value => typeof value === 'string'? value: value.nombre),   
      mergeMap(value =>
        {          
          if( value.trim() === '' || !value ){          
            return [];
          }          
          return this._filter(value.trim());

        })      
    );

  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();        
    return this.facturaService.filtrarProductos( value );
  }

  mostrarNombre( producto?:Producto ): string | undefined{

    return producto? producto.nombre: undefined;


  }



}
