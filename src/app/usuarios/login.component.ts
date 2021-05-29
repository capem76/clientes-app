import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo: string = 'Por favor Sign in!'
  loginForm: FormGroup;

  constructor() {
    this.inicializaFormulario();
   }

  ngOnInit(): void {
    
  }

  inicializaFormulario(){
    this.loginForm = new FormGroup({
      username: new FormControl('',[Validators.required]),
      password: new FormControl('',[ Validators.required ])
    });

  }
  
  login(){
    console.debug(this.loginForm);
    
  }
}
