import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';
import { ActivatedRoute } from "@angular/router";
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, flatMap, mergeMap } from 'rxjs/operators';
import { FacturaService } from './services/factura.service';
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from './models/item-factura';

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

  seleccionarProducto( event: MatAutocompleteSelectedEvent ): void{
    let producto = event.option.value as Producto;
    console.debug(producto);

    if( this.isExisteItem( producto.id ) ){
      this.incrementaCantidad( producto.id );
    }else {

      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push( nuevoItem );
  
    }
    
    this.autoCompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();


  }

  actualizarCantidad( idProducto: number , event: any ):void {
    let cantidad: number = event.target.value as number;
    console.debug("actualizo cantidad: " + cantidad);
    if( cantidad == 0 ){
       return this.eliminarItemFactura(idProducto);

    }

    this.factura.items = this.factura.items.map( (item: ItemFactura) => {
      if(idProducto === item.producto.id){
        item.cantidad = cantidad;
      }
      return item;
    });



  }

  isExisteItem( idProducto: number): boolean {
    let existe: boolean = false;
    this.factura.items.forEach( ( item: ItemFactura ) => {
      if( idProducto === item.producto.id ){
        existe = true;
        
      }
    });
    return existe;
  }

  incrementaCantidad( idProducto: number ): void {    

    this.factura.items = this.factura.items.map( (item: ItemFactura) => {
      if(idProducto === item.producto.id){
        ++item.cantidad;
      }
      return item;
    });
    
  }

  eliminarItemFactura(idProducto: number): void {
    this.factura.items = this.factura.items.filter( (item: ItemFactura) => 
      idProducto !== item.producto.id
    );

  }



}
