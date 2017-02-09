import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
	fireAuth;
	constructor(public af: AngularFire) {
        af.auth.subscribe( user => {
        	if (user) { this.fireAuth = user.auth; }
        });
	}

	logIn() {
		return this.af.auth.login();
	}

	logOut() {
		return this.af.auth.logout();
	}

	authOrNot(): Observable<boolean> {
		return this.af.auth
			.map((auth) => {
				if(auth == null) {
					return false;
				} else {
					return true;
				}
			})
	}

	get fbData() {
		return this.fireAuth;
	}
}