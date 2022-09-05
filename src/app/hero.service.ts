import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class HeroService {
	getHeroes(): Observable<Hero[]> {
		return this.http.get<Hero[]>(this.heroesUrl).pipe(
			tap((_) => this.log('fetching heroes')),
			catchError(this.handlError<Hero[]>('getHeroes', []))
		);
	}
	getHero(id: number): Observable<Hero> {
		const url = `${this.heroesUrl}/${id}`;
		return this.http.get<Hero>(url).pipe(
			tap((_) => this.log(`fetching hero id=${id}`)),
			catchError(this.handlError<Hero>(`getHero id=${id}`))
		);
	}

	// Put Hero to Update Service
	httpOptions = {
		headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
	};

	updateHero(hero: Hero): Observable<any> {
		return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
			tap((_) => this.log(`update hero with id: ${hero.id}`)),
			catchError(this.handlError<any>(`Update Hero`))
		);
	}

	//Post new Hero
	addHero(hero: Hero): Observable<Hero> {
		return this.http
			.post<Hero>(this.heroesUrl, hero, this.httpOptions)
			.pipe(
				tap((newHero: Hero) =>
					this.log(`added hero w/ id=${newHero.id}`)
				),
				catchError(this.handlError<Hero>(`addHero`))
			);
	}
	//Delete Hero

	deleteHero(id: number): Observable<Hero> {
		const url = `${this.heroesUrl}/${id}`

		return this.http.delete<Hero>(url, this.httpOptions).pipe(
			tap(_ => this.log(`deleted hero id=${id}`)),
			catchError(this.handlError<Hero>(`deleteHero`))
		)
	}

	private log(message: string) {
		this.messageService.add(`HeroService: ${message}`);
	}
	private heroesUrl = 'api/heroes'; // URL to web API
	private handlError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.error(error);
			this.log(`${operation} faild: ${error.message}`);
			return of(result as T);
		};
	}
	constructor(
		private http: HttpClient,
		private messageService: MessageService
	) {}
}
