import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Match } from '../app/match';

/*
  Generated class for the Matches provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MatchesService {

	matches: Match[] = [];

	regMatches;
	regPolls;
	//match;

	items: FirebaseListObservable<any[]>;

	constructor(public af: AngularFire) {

		/*this.match = af.database.list('/matches');

		// Save data in Firebase list
		this.match.push({
			matches: this.matches
		});*/

		this.items = af.database.list('/matches');
        // subscribe to changes
        this.items.subscribe(
        	queriedItems => {
        		console.log('queried');
        		this.prepareMatchesList(queriedItems);
        	}
        );
	}

	getMatches(): Promise<Match[]> {
		return Promise.resolve(this.matches);
	}

	// Open a material dialog for feedback the user
	prepareMatchesList(algo) {
		var matches = algo[0].matches;
		for (var i = 0; i < matches.length; ++i) {
			this.matches.push( new Match( matches[i].teamName1, matches[i].teamName2, matches[i].date ) );
		}
	}

}
