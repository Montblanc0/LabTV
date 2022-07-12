import { DOCUMENT } from "@angular/common";
import {
	Component,
	Inject,
	EventEmitter,
	Input,
	OnInit,
	OnDestroy,
	Output,
	Renderer2,
	SimpleChanges,
} from "@angular/core";
import { Subscription, map } from "rxjs";
import Movie from "../models/movies.model";
import { AuthService } from "../services/auth.service";
import { MovieService } from "../services/movie.service";
import { BehaviorSubject } from "rxjs";
import ReglogOverlayService from "../services/reglog-overlay.service";
@Component({
	selector: "app-overlay",
	templateUrl: "./overlay.component.html",
	styleUrls: ["./overlay.component.css"],
})
export class OverlayComponent implements OnInit, OnDestroy {
	@Input() movie: any;
	@Output() closeOverlay: EventEmitter<any> = new EventEmitter<boolean>();
	@Output() addMovie: EventEmitter<any> = new EventEmitter<string>();
	@Output() deleteMovie: EventEmitter<any> = new EventEmitter<string>();
	@Output() addPref: EventEmitter<any> = new EventEmitter<string>();
	@Output() removePref: EventEmitter<any> = new EventEmitter<string>();

	isLoggedIn: boolean = false;
	disabler: boolean = false;
	refresher$$!: Subscription;
	subscription!: Subscription;
	hasMovie: boolean = false;
	hasMovie$ = new BehaviorSubject<boolean>(false);
	hasMovie$$ = this.hasMovie$.asObservable();
	hasSubscription!: Subscription;
	likesMovie: boolean = false;
	likesMovie$ = new BehaviorSubject<boolean>(false);
	likesMovie$$ = this.likesMovie$.asObservable();
	likesSubscription!: Subscription;
	ownedId: number | undefined = undefined;
	likedId: number | undefined = undefined;
	// lastSeen = "";
	// seenSubscription!: Subscription;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private renderer: Renderer2,
		private auth: AuthService,
		private movieService: MovieService,
		private emitter: ReglogOverlayService
	) {}

	ngOnInit(): void {
		console.log(this.movie);
		// this.seenSubscription = this.movieService.seenStatus.subscribe(
		// 	movieId => (this.lastSeen = movieId)
		// );

		this.renderer.addClass(this.document.body, "no-scroll");

		this.subscription = this.auth.authStatus.subscribe(bool => {
			this.isLoggedIn = bool;
		});

		this.hasSubscription = this.hasMovie$$.subscribe(
			bool => (this.hasMovie = bool)
		);
		this.likesSubscription = this.likesMovie$$.subscribe(
			bool => (this.likesMovie = bool)
		);

		this.getOwnedStatus();
		this.getFavouriteStatus();

		// if (!this.lastSeen || this.lastSeen != this.movie.id) {
		// 	this.getOwnedStatus();
		// 	this.getFavouriteStatus();
		// 	this.movieService.setLastSeen(this.movie.id);
		// 	console.log("lastseen set: " + this.lastSeen);
		// }

		this.refresher$$ = this.emitter.refresher$.subscribe(bool => {
			if (bool) {
				this.emitter.refreshSignal(false);
				// this.ngOnDestroy();
				this.ngOnInit();
				if (!this.isLoggedIn) {
					this.hasMovie = false;
					this.likesMovie = false;
				}
			}
		});
	}

	ngOnChanges(changes: SimpleChanges) {
		//viene eseguito anche ad init
		if (changes["movie"]) {
			// this.hasMovie = false;
			// this.likesMovie = false;
			this.getOwnedStatus();
			this.getFavouriteStatus();
			// this.ngOnInit();
			// this.movieService.setLastSeen(this.movie.id);
		}
	}

	counter(i: number) {
		return new Array(i);
	}

	private getOwnedStatus() {
		if (this.isLoggedIn) {
			this.disabler = true;
			this.movieService
				.getOwnedMovies(this.auth.getUser()?.user.id)
				.pipe(
					map((data: Movie[]) =>
						data.filter(movie => movie.movieId == this.movie.id)
					)
				)
				.subscribe(
					res => {
						if (res.length) {
							this.hasMovie$.next(true);
							this.ownedId = res[0].id;
						} else if (this.hasMovie == true)
							this.hasMovie$.next(false);
						this.disabler = false;
					},
					error => {
						console.log(error);
						this.disabler = false;
					}
				);
		}
	}

	private getFavouriteStatus() {
		if (this.isLoggedIn) {
			this.disabler = true;
			this.movieService
				.getFavourites(this.auth.getUser()?.user.id)
				.pipe(
					map((data: Movie[]) =>
						data.filter(movie => movie.movieId == this.movie.id)
					)
				)
				.subscribe(
					res => {
						if (res.length) {
							this.likesMovie$.next(true);
							this.likedId = res[0].id;
						} else if (this.likesMovie == true)
							this.likesMovie$.next(false);
						this.disabler = false;
					},
					error => {
						console.log(error);
						this.disabler = false;
					}
				);
		}
	}

	ngOnDestroy(): void {
		this.renderer.removeClass(this.document.body, "no-scroll");
		this.subscription.unsubscribe();
		this.likesSubscription.unsubscribe();
		this.hasSubscription.unsubscribe();
		this.refresher$$.unsubscribe();
		// this.seenSubscription.unsubscribe();
		// this.hasMovie = false;
		// this.likesMovie = false;
	}

	hideOverlay(): void {
		this.closeOverlay.emit(1);
		// this.ngOnDestroy();
	}

	buyMovie(movieId: string): void {
		if (!this.checkLogin()) return;
		if (!this.hasMovie) {
			let userId = this.auth.getUser()?.user.id;
			if (!userId) {
				console.log("Errore, riprova.");
				return;
			}
			const movie = {
				userId: userId,
				movieId: movieId,
			};
			this.movieService
				.addMovie(movie)
				.subscribe(
					res => {
						console.log(res);
						this.hasMovie$.next(true);
						this.addMovie.emit(this.movie.id);
					},
					err => console.log(err)
				)
				.add(this.getOwnedStatus());
		}
	}

	likeMovie(movieId: string): void {
		if (!this.checkLogin()) return;
		//extra check per cambio db_id
		this.getFavouriteStatus();
		if (!this.likesMovie) {
			let userId = this.auth.getUser()?.user.id;
			if (!userId) {
				console.log("Errore, riprova.");
				return;
			}
			const movie = {
				userId: userId,
				movieId: movieId,
			};

			this.movieService
				.addFavourite(movie)
				.subscribe(
					res => {
						console.log(res);
						this.likesMovie$.next(true);
						this.addPref.emit(this.movie.id);
					},
					err => console.log(err)
				)
				.add(this.getFavouriteStatus());
		}
	}

	unlikeMovie(): void {
		if (!this.checkLogin()) return;
		//extra check per cambio db_id
		this.getFavouriteStatus();
		if (this.likesMovie) {
			this.movieService
				.deleteFavourite(this.likedId)
				.subscribe(
					res => {
						console.log(res);
						this.likesMovie$.next(false);
						this.removePref.emit(this.movie.id);
					},
					err => console.log(err)
				)
				.add(this.getFavouriteStatus());
		}
	}

	returnMovie(): void {
		if (!this.checkLogin()) return;
		//extra check per cambio db_id
		this.getOwnedStatus();
		if (this.hasMovie) {
			this.movieService
				.deleteMovie(this.ownedId)
				.subscribe(
					res => {
						console.log(res);
						this.hasMovie$.next(false);
						this.deleteMovie.emit(this.movie.id);
					},
					err => console.log(err)
				)
				.add(this.getOwnedStatus());
		}
	}

	checkLogin(): boolean {
		if (!this.isLoggedIn) {
			this.emitter.openSignal(true);
			return false;
		}
		return true;
	}
}
