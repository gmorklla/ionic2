import { Component } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Subject } from 'rxjs/Subject';
import { Match } from '../../app/match';
import { MatchesService } from '../../providers/matches.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	nombre: string;
	matches: Match[];
	fbData;
	// Array of registered polls
	regPolls;
	// Firebase list of polls for save data
	polls: FirebaseListObservable<any>;
	// Firebase list to keep track of registered polls
	items: FirebaseListObservable<any[]>;

	constructor(public navCtrl: NavController, public af: AngularFire, private matchesService: MatchesService, public actionSheetCtrl: ActionSheetController) {
		// Check for user auth
		this.af.auth.subscribe(auth => {
		  // If the user have log in
		  if(auth) {
		    this.fbData = auth.auth;

		    this.polls = af.database.list('/polls');

		    this.items = af.database.list('/polls', {
		      query: {
		        orderByKey: true
		      }
		    });
		    // subscribe to changes
		    this.items.subscribe(queriedItems => {
		      this.regPolls = queriedItems;
		      console.log(queriedItems);
		    });
		  // Set fbData as undefined
		  } else {
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

	presentActionSheet() {
		let actionSheet = this.actionSheetCtrl.create({
			title: 'Modify your album',
			buttons: [
			{
			  text: 'Destructive',
			  role: 'destructive',
			  handler: () => {
			    console.log('Destructive clicked');
			  }
			},{
			  text: 'Archive',
			  handler: () => {
			    console.log('Archive clicked');
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

}
