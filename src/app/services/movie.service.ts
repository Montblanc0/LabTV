import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as _ from "lodash";
import { map, Observable } from "rxjs";
import Movie from "../models/movies.model";
import { AuthService } from "./auth.service";
import { BehaviorSubject } from "rxjs";
@Injectable({
	providedIn: "root",
})

//Interagisce con il database di json-server
export class MovieService {
	private JSON_SRV = "http://localhost:3000/";

	// private lastSeen = new BehaviorSubject<string>("");
	// seenStatus = this.lastSeen.asObservable();

	constructor(private http: HttpClient, private auth: AuthService) {}

	addMovie(movie: any): Observable<any> {
		const user = this.auth.getUser();
		return this.http.post<any>(this.JSON_SRV + "movies/", movie, {
			headers: { Authorization: "Bearer " + user?.accessToken },
		});
	}

	deleteMovie(movieId: number | undefined): Observable<void> {
		const user = this.auth.getUser();
		return this.http.delete<void>(this.JSON_SRV + "movies/" + movieId, {
			headers: { Authorization: "Bearer " + user?.accessToken },
		});
	}

	addFavourite(movie: any): Observable<any> {
		const user = this.auth.getUser();
		return this.http.post<any>(this.JSON_SRV + "likes/", movie, {
			headers: { Authorization: "Bearer " + user?.accessToken },
		});
	}
	deleteFavourite(movieId: number | undefined): Observable<void> {
		const user = this.auth.getUser();
		return this.http.delete<void>(this.JSON_SRV + "likes/" + movieId, {
			headers: { Authorization: "Bearer " + user?.accessToken },
		});
	}

	getFavourites(userId: number | undefined): Observable<Movie[]> {
		const user = this.auth.getUser();
		return this.http
			.get<Movie[]>(this.JSON_SRV + "likes/", {
				headers: { Authorization: "Bearer " + user?.accessToken },
			})
			.pipe(
				map((data: Movie[]) =>
					data.filter(movie => movie.userId == userId)
				)
			);
	}

	getOwnedMovies(userId: number | undefined): Observable<Movie[]> {
		const user = this.auth.getUser();
		return this.http
			.get<Movie[]>(this.JSON_SRV + "movies/", {
				headers: { Authorization: "Bearer " + user?.accessToken },
			})
			.pipe(
				map((data: Movie[]) =>
					data.filter(movie => movie.userId == userId)
				)
			);
	}

	// setLastSeen(movieId: string) {
	// 	this.lastSeen.next(movieId);
	// }
}
