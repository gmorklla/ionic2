import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { AuthComponent } from './auth/auth.component';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { MatchesService } from '../providers/matches.service';
import { AuthService } from '../providers/auth-service';

// Must export the config
export const firebaseConfig = {
  apiKey: "AIzaSyAyJljq4EsyRa65RJTaAFnc6Nf0D9zg2zw",
  authDomain: "angular2firebase-a3851.firebaseapp.com",
  databaseURL: "https://angular2firebase-a3851.firebaseio.com",
  storageBucket: "angular2firebase-a3851.appspot.com",
  messagingSenderId: "532377730187"
};

const myFirebaseAuthConfig = {
  provider: AuthProviders.Facebook,
  method: AuthMethods.Popup,
  scope: ['email']
};

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    AuthComponent
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, MatchesService, AuthService]
})
export class AppModule {}
