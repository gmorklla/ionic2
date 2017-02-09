import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Subject } from 'rxjs/Subject';
import { Match } from '../../app/match';
import { Result } from '../../app/result';
import { MatchesService } from '../../providers/matches.service';
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

	nombre: string;
	matches: Match[];
	fbData;
	// Array of results
	results: Result[] = [];
	// Array of registered polls
	regPolls;
	// Firebase list of polls for save data
	polls: FirebaseListObservable<any>;
	// Firebase list to keep track of registered polls
	items: FirebaseListObservable<any[]>;

	constructor(public navCtrl: NavController, public af: AngularFire, private matchesService: MatchesService, public actionSheetCtrl: ActionSheetController, public authData: AuthService) { }

	ngOnInit() {
	    this.authData.authOrNot().subscribe( user => {
	      if (user) {
		    this.fbData = this.authData.fbData;

		    this.polls = this.af.database.list('/polls');

		    this.items = this.af.database.list('/polls', {
		      query: {
		        orderByKey: true
		      }
		    });
		    // subscribe to changes
		    this.items.subscribe(queriedItems => {
				this.regPolls = queriedItems;
				console.log(queriedItems);
		    });
	      } else {
	        console.error('Not log in');
	        this.fbData = undefined;
	      }
	    });

	    this.gettingMatches();
	}

	gettingMatches() {
		this.matchesService.getMatches().then(matches => {
		  this.matches = matches;
		  console.log(this.matches);
		});
	}

	presentActionSheet(team1, team2, indice) {
		let actionSheet = this.actionSheetCtrl.create({
			title: 'Escoge',
			buttons: [
				{
				  text: team1,
				  handler: () => {
					console.log('Team1 clicked');
					let resultado: Result = new Result(team1, indice);
					this.setResults(resultado);
				  }
				},{
				  text: 'Empate',
				  handler: () => {
				    console.log('Tie clicked');
					let resultado: Result = new Result('empate', indice);
					this.setResults(resultado);
				  }
				},{
				  text: team2,
				  handler: () => {
				    console.log('Team2 clicked');
					let resultado: Result = new Result(team2, indice);
					this.setResults(resultado);
				  }
				},{
				  text: 'Cancel',
				  role: 'cancel',
				  handler: () => {
				    console.log('Cancel clicked');
				  }
				}
			]
		});
		actionSheet.present();
	}

	// Feed the result array with the user selections
	setResults(e: Result) {
		this.results[e.indice] = e;
		console.log(this.results);
	}
	// Save function
	saveIt() {
		if(this.fbData == undefined) {
			// Feedback the user
			console.log('No has iniciado sesión');
			return;
		}

		// Denie save feature if not all results have been defined
		if(this.results.length != this.matches.length) {
			// Feedback the user
			console.log('Te faltan pronósticos por llenar');
			return;
		}
		// Denie save feature if user have a poll registered
		if(this.checkRegPolls()) {
			// Feedback the user
			console.log('Ya habías ingresado tu quiniela');
			return;
		}

		// Save data in Firebase list
		this.polls.push({
			resultados: this.results,
			id: this.fbData.uid,
			foto: this.fbData.photoURL,
			nombre: this.fbData.displayName
		})
			.then(_ => console.log('Tu quiniela ha sido guardada'))
			.catch(err => console.log('Hubo un problema al guardar tu quiniela, intenta de nuevo.'));
	}

	checkRegPolls(): boolean {
		for (var i = 0; i < this.regPolls.length; ++i) {
			if(this.regPolls[i].id == this.fbData.uid) {
				return true;
			}
		}
		return false;
	}

}
