import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import { Usuario } from '../usuarios/usuario';
import Swal2 from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {

  title: string = "Clientes App"

  constructor( private authService: AuthService , private router: Router) { }

  ngOnInit(): void {

  }

  isAutenticado():boolean {
    return this.authService.isAuthenticated();
  }

  getUser():Usuario {
    return this.authService.usuario;
  }

  logout():void{
    let usuario: Usuario = this.authService.usuario;
    this.authService.logoout();
    Swal2.fire({
      title: 'Logout',
      text: `Hola ${usuario.username} has Cerrado session!!!`,
      icon: 'success'
    });
    this.router.navigate(['/login']);
    
  }

}
