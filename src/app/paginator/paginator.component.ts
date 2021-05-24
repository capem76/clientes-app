import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PageCliente } from '../model/interfaces/page-cliente';


@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnChanges {

  @Input() pagesClientes: PageCliente;
  paginas: number[];

  paginaDesde: number;
  paginaHasta: number;
  

  constructor() { }

  
  ngOnInit(): void {
    this.iniciarArrayPaginas();
  }
  
  ngOnChanges(changes: SimpleChanges): void {

    let pagesClientesUpdated = changes['pagesClientes'];        
    if ( pagesClientesUpdated.previousValue ) {
      this.iniciarArrayPaginas();
    }

    
  }

  private iniciarArrayPaginas(): void {
    this.paginaDesde = Math.min(
      Math.max(1, this.pagesClientes.number - 4), this.pagesClientes.totalPages - 5
    );
    this.paginaHasta = Math.max( 
      Math.min( this.pagesClientes.totalPages, this.pagesClientes.number + 4 ), 6
    );

    if (this.pagesClientes.totalPages > 5) {
      this.paginas = new Array(this.paginaHasta - this.paginaDesde + 1)
        .fill(0)
        .map((_valor, indice) => indice + this.paginaDesde);

    } else {

      this.paginas = new Array(this.pagesClientes.totalPages)
        .fill(0)
        .map((_valor, indice) => indice + 1);
    }

  }

}
