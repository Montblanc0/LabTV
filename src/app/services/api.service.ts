import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
@Injectable({
	providedIn: "root",
})
export class ApiService {
	constructor(private http: HttpClient) {}

	private myIMDbKey: string = "k_1ae6qj82";

	mostPopular(): Observable<any> {
		return this.http.get(
			`https://imdb-api.com/it/API/MostPopularMovies/${this.myIMDbKey}`
		);
	}

	movieDetail(id: string): Observable<any> {
		return this.http.get(
			`https://imdb-api.com/it/API/Title/${this.myIMDbKey}/${id}`
		);
	}

	searchAll(expression: string): Observable<any> {
		return this.http.get(
			`https://imdb-api.com/it/API/SearchAll/${this.myIMDbKey}/${expression}`
		);
	}

	searchMovie(movie: string): Observable<any> {
		return this.http.get(
			`https://imdb-api.com/it/API/SearchMovie/${this.myIMDbKey}/${movie}`
		);
	}

	ytTrailer(id: string): Observable<any> {
		return this.http.get(
			`https://imdb-api.com/it/API/YouTubeTrailer/${this.myIMDbKey}/${id}`
		);
	}
}
