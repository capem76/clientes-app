import { Component, Input, OnInit } from '@angular/core';
import { PageCliente } from '../model/interfaces/page-cliente';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {

  @Input() pagesClientes: PageCliente;
  paginas: number[];

  constructor() { }

  ngOnInit(): void {
    this.paginas = new Array(this.pagesClientes.totalPages)
      .fill(0)
      .map((_valor, indice) => indice + 1 );
  }

}
