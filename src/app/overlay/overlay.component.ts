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
import { LocalStorageService } from "../services/local-storage.service";
import { MovieService } from "../services/movie.service";
import { BehaviorSubject } from "rxjs";
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
	subscription!: Subscription;
	hasMovie: boolean = false;
	hasMovie$ = new BehaviorSubject<boolean>(false);
	hasMovie$$ = this.hasMovie$.asObservable();
	hasSubscription!: Subscription;
	likesMovie: boolean = false;
	likesMovie$ = new BehaviorSubject<boolean>(false);
	likesMovie$$ = this.likesMovie$.asObservable();
	likesSubscription!: Subscription;
	movieDB_id: number | undefined = undefined;
	lastSeen = "";
	seenSubscription!: Subscription;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private renderer: Renderer2,
		private auth: AuthService,
		private movieService: MovieService,
		private ls: LocalStorageService
	) {}

	counter(i: number) {
		return new Array(i);
	}

	ngOnInit(): void {
		this.seenSubscription = this.movieService.seenStatus.subscribe(
			movieId => (this.lastSeen = movieId)
		);
		console.log(this.lastSeen);
		this.renderer.addClass(this.document.body, "no-scroll");
		this.subscription = this.auth.authStatus.subscribe(
			bool => (this.isLoggedIn = bool)
		);
		this.hasSubscription = this.hasMovie$$.subscribe(
			bool => (this.hasMovie = bool)
		);
		this.likesSubscription = this.likesMovie$$.subscribe(
			bool => (this.likesMovie = bool)
		);

		if (!this.lastSeen || this.lastSeen != this.movie.id) {
			this.movieService.setLastSeen(this.movie.Id);
			this.getOwnedStatus();
			this.getFavouriteStatus();
		}
	}
	ngOnChanges(changes: SimpleChanges) {
		if (changes["movie"]) {
			this.movieService.setLastSeen(this.movie.Id);
			this.getOwnedStatus();
			this.getFavouriteStatus();
		}
	}
	private getOwnedStatus() {
		if (this.isLoggedIn) {
			this.movieService
				.getOwnedMovies(this.auth.getUser()?.user.id)
				.pipe(
					map((data: Movie[]) =>
						data.filter(movie => movie.movieId == this.movie.id)
					)
				)
				.subscribe(res => {
					if (res.length) {
						this.hasMovie$.next(true);
						this.movieDB_id = res[0].id;
					} else if (this.hasMovie == true)
						this.hasMovie$.next(false);
				});
		}
	}
	private getFavouriteStatus() {
		if (this.isLoggedIn) {
			this.movieService
				.getFavourites(this.auth.getUser()?.user.id)
				.pipe(
					map((data: Movie[]) =>
						data.filter(movie => movie.movieId == this.movie.id)
					)
				)
				.subscribe(res => {
					if (res.length) {
						this.likesMovie$.next(true);
						this.movieDB_id = res[0].id;
					} else if (this.likesMovie == true)
						this.likesMovie$.next(false);
				});
		}
	}

	ngOnDestroy(): void {
		this.renderer.removeClass(this.document.body, "no-scroll");
		this.subscription.unsubscribe();
		this.likesSubscription.unsubscribe();
		this.hasSubscription.unsubscribe();
	}
	hideOverlay(): void {
		this.closeOverlay.emit(1);
	}

	buyMovie(movieId: string): void {
		if (!this.isLoggedIn) return;
		const movie = {
			userId: this.auth.getUser()?.user.id,
			movieId: movieId,
		};

		this.movieService.addMovie(movie).subscribe(
			res => {
				console.log(res);
				this.hasMovie$.next(true);
				this.addMovie.emit(this.movie.id);
			},
			err => console.log(err)
		);
	}
	likeMovie(movieId: string): void {
		if (!this.isLoggedIn) return;
		const movie = {
			userId: this.auth.getUser()?.user.id,
			movieId: movieId,
		};

		this.movieService.addFavourite(movie).subscribe(
			res => {
				console.log(res);
				this.likesMovie$.next(true);
				this.addPref.emit(this.movie.id);
			},
			err => console.log(err)
		);
	}
	unlikeMovie(): void {
		if (!this.isLoggedIn) return;
		this.movieService.deleteFavourite(this.movieDB_id).subscribe(
			res => {
				console.log(res);
				this.likesMovie$.next(false);
				this.removePref.emit(this.movie.id);
			},
			err => console.log(err)
		);
	}
	returnMovie(): void {
		if (!this.isLoggedIn) return;
		this.movieService.deleteMovie(this.movieDB_id).subscribe(
			res => {
				console.log(res);
				this.hasMovie$.next(false);
				this.deleteMovie.emit(this.movie.id);
			},
			err => console.log(err)
		);
	}
}
