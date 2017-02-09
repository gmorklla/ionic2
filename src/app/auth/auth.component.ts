import { Component, Input, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styles: ['[icon-left] ion-icon { line-height: 1;}']
})
export class AuthComponent implements OnInit {

  nombre;

  @Input() content;

  constructor(public af: AngularFire, public authData: AuthService) { }

  ngOnInit() {
    this.authData.authOrNot().subscribe( user => {
      if (user) {
        this.nombre = this.authData.fbData.displayName;
      } else {
        this.nombre = null;
      }
    });
  }

  login() {
    this.authData.logIn().then(function (result) {
      console.log(result);
    });
  }

  logout() {
    this.authData.logOut().then(function () {
      console.log('Log out');
    });
  }

}