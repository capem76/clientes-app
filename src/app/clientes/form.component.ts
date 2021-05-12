import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from "sweetalert2";
import {  FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit, OnDestroy {

  titulo: string = "Formulario crear Cliente";
  cliente: Cliente = new Cliente(); 
  private suscriptionObjs: SuscriptionObjs = new SuscriptionObjs();  
  private subscriptionArray: Subscription[] = [];
  formuCliente: FormGroup;
  private nombreClientCtrl: FormControl;  
  private apellidoClienteCtrl: FormControl;
  private emailClienteCtrl: FormControl;
  private createAtClienteCtrl: FormControl;
  private _errores: string[];
  
  constructor( private clienteService: ClienteService,
               private router: Router,
               private activedRoute: ActivatedRoute ) { 
    
    this.formuCliente = this.creaFormGroupControl();

  }

  public get errores(): string[] {
    return this._errores;
  }

  public set errores(value: string[]) {
    this._errores = value;
  }
  

  ngOnInit(): void {

    this.cargarCliente();
    this.inicializarControles();
    
  }

  ngOnDestroy(): void {
    this.subscriptionArray.forEach( (subuscription) => subuscription.unsubscribe() )    
  }

  create( ): void{
    
    this.clienteService.create( this.cliente )
      .subscribe(                
        json => {
          this.router.navigate(['/clientes']);
          Swal.fire({
            title: 'Nuevo Cliente',
            text: `${json.mensaje}: ${json.cliente.nombre}`,
            icon: 'success'
            
          });
        },
        err => {
          console.error( `codigo del error desde el backend:  ${err.error.errors}` );
          console.error( err.error.errors );
          this.errores = err.error.errors as string[];
        }
      );
        
  }

  private cargarCliente(): void{
    this.activedRoute.params.subscribe( params => {
      let id = params[ 'id' ];
      if ( id ) {
        this.clienteService.getCliente( id ).subscribe( (cliente) => {
          this.cliente = cliente;
          this.nombreClientCtrl.setValue(cliente.nombre);
          this.apellidoClienteCtrl.setValue(cliente.apellido);
          this.emailClienteCtrl.setValue(cliente.email);
        });        
      }
    });
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
      },
      err => {
        console.error( `codigo del error desde el backend:  ${err.error.errors}` );
        console.error( err.error.errors );
        this.errores = err.error.errors as string[];
      }
    );
  }

  onSubmit(): void{
    
    console.log( this.formuCliente.value );
    console.log(this.formuCliente);
    console.log(this.cliente);
    

  }

  private creaFormGroupControl(): FormGroup{

    let newFormGroup: FormGroup = new FormGroup({

      nombreCliente: new FormControl('',[
        Validators.required,
        Validators.minLength(4)
      ]),
      apellidoCliente: new FormControl('',[
        Validators.required,
        Validators.minLength(4)
      ]),
      emailCliente: new FormControl('',[        
        Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')
      ]),
      createAtCliente: new FormControl('',[])
    });

    return newFormGroup;

  }

  private inicializarControles(): void{

    this.nombreClientCtrl = this.formuCliente.get('nombreCliente') as FormControl;
    this.apellidoClienteCtrl = this.formuCliente.get('apellidoCliente') as FormControl;
    this.emailClienteCtrl = this.formuCliente.get('emailCliente') as FormControl;
    this.createAtClienteCtrl = this.formuCliente.get('createAtCliente') as FormControl;
    

    this.suscriptionObjs.objSubs1 =  this.nombreClientCtrl.valueChanges
      .subscribe( (nombreVal: string) => this.cliente.nombre = nombreVal.trim() );

    this.suscriptionObjs.objSubs2 = this.apellidoClienteCtrl.valueChanges
      .subscribe( (apellidoVal: string) => this.cliente.apellido = apellidoVal.trim() );
      
    this.suscriptionObjs.objSubs3 = this.emailClienteCtrl.valueChanges
      .subscribe( (emailvalue: string)  => this.cliente.email = emailvalue.trim() );
    
    this.suscriptionObjs.objSubs4 = this.createAtClienteCtrl.valueChanges
      .subscribe( (createAtValue: string) => this.cliente.createAt = createAtValue );

   this.subscriptionArray.push( this.suscriptionObjs.objSubs1 );
   this.subscriptionArray.push( this.suscriptionObjs.objSubs2 );
   this.subscriptionArray.push( this.suscriptionObjs.objSubs3 );
   this.subscriptionArray.push( this.suscriptionObjs.objSubs4 );

  }

  

}

export class SuscriptionObjs {
  objSubs1: Subscription;
  objSubs2: Subscription;
  objSubs3: Subscription;
  objSubs4: Subscription;

}


