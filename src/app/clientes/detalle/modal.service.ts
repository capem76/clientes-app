import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private _modal: boolean = false; 
  private _notificarUpload = new EventEmitter<any>();
  
  constructor() { }

  public get notificarUpload(): EventEmitter<any> {
    return this._notificarUpload;
  }
  

  public get modal(): boolean {
    return this._modal;
  }
  public set modal(value: boolean) {
    this._modal = value;
  }

  cerrarModal(){
    this.modal = false;
  }

  abrirModal(){
    this.modal = true;
  }

}
