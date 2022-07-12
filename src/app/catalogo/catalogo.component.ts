import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, of, Subscription } from "rxjs";
import { ApiService } from "../services/api.service";
import { AuthService } from "../services/auth.service";
import { LocalStorageService } from "../services/local-storage.service";
import { MovieService } from "../services/movie.service";
import * as _ from "lodash";

@Component({
	selector: "app-catalogo",
	templateUrl: "./catalogo.component.html",
	styleUrls: ["./catalogo.component.css"],
})
export class CatalogoComponent implements OnInit {
	searchTerm: string = "";
	searchFilter: string = "title";
	movie: any = "";
	isOverlayVisible: boolean = false;
	catalogo: any = [];
	movies$: Observable<any> = of(this.catalogo);
	subscription!: Subscription;
	movieSubscription!: Subscription;
	errorMessage: string = "";

	constructor(
		private api: ApiService,
		private ls: LocalStorageService,
		private movieService: MovieService,
		private auth: AuthService,
		private router: Router
	) {}

	logCatalogo() {
		console.log(this.catalogo);
	}

	ngOnInit(): void {
		this.subscription = this.auth.authStatus.subscribe(bool => {
			if (!bool) {
				this.router.navigate([""]);
			}
		});
		this.getCatalogo();
	}

	getMovieDetail(id: any): void {
		if (!this.ls.get(id) || this.movie?.id != id) {
			let movieObject: Object;
			this.api
				.movieDetail(id)
				.subscribe(data => {
					movieObject = data;
					//Ottengo contemporaneamente il link di YouTube da passare al player component
				})
				.add(() => {
					this.api.ytTrailer(id).subscribe(data => {
						this.movie = { ...movieObject, videoId: data.videoId };
						console.log(this.movie);
						this.ls.set(id, this.movie);
					});
				});
		} else {
			this.movie = this.ls.get(id);
		}
		this.isOverlayVisible = true;
	}

	hideOverlay(bit: boolean): void {
		if (bit) this.isOverlayVisible = false;
	}

	getCatalogo() {
		const user = this.auth.getUser();
		this.movieService
			.getOwnedMovies(user?.user.id)
			.pipe(
				catchError(error => {
					if (error.error instanceof ErrorEvent) {
						this.errorMessage =
							"Errore client: " + error.error.message;
					} else {
						console.log(error);
						if (error.status == 401) {
							if (error.error == "jwt expired")
								this.errorMessage =
									"La sessione è scaduta, accedi di nuovo";
							else
								this.errorMessage =
									"Non sei autorizzato ad accedere a questa risorsa";
						} else {
							this.errorMessage = "Server non raggiungibile";
						}
					}
					return of([]);
				})
			)
			.subscribe(data => {
				console.log(data);
				if (data.length) {
					data.forEach(item => {
						this.api.movieDetail(item.movieId).subscribe(data => {
							console.log(data);
							this.catalogo.push(data);
						});
					});
				} else if (this.errorMessage) {
					return;
				} else
					this.errorMessage =
						"Il tuo catalogo è momentaneamente vuoto";
				console.log(this.catalogo);
			});
	}
	addItem(movieId: string) {
		this.api.movieDetail(movieId).subscribe(data => {
			console.log(data);
			this.catalogo.push(data);
		});
	}

	removeItem(movieId: string) {
		_.remove(this.catalogo, (item: any) => {
			return item.id === movieId;
		});
		if (!this.catalogo.length) {
			this.errorMessage = "Il tuo catalogo è momentaneamente vuoto";
		}
		console.log("item removed");
		console.log(this.catalogo);
	}
}
