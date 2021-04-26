import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css']
})
export class DirectivaComponent implements OnInit {

  listaCurso: string[] = ['TypeScript','Javascript', 'Java SE', 'C#', 'PHP'];
  isOculto: boolean = false;

  constructor() { }

  ngOnInit(): void {
    
  }

  ocultar( oculto: boolean ){
    this.isOculto = oculto;
  }

}
