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
		return this.http
			.get<Hero[]>(this.heroesUrl)
			.pipe(
				tap(_ => this.log('fetching heroes')),
				catchError(this.handlError<Hero[]>('getHeroes', []))
			);
	}
	getHero(id: number): Observable<Hero> {
		const url = `${this.heroesUrl}/${id}`;
		return this.http.get<Hero>(url).pipe(
			tap(_ => this.log(`fetching hero id=${id}`)),
			catchError(this.handlError<Hero>(`getHero id=${id}`))
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
