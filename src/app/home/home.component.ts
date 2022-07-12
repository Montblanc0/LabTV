import { Component, OnInit } from "@angular/core";
import { Observer } from "rxjs";
import { ApiService } from "../services/api.service";
import { LocalStorageService } from "../services/local-storage.service";
import * as _ from "lodash";
@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
	data: any = [];
	isDataReady: boolean = false;
	movie: any = "";
	response$: any[] = [];
	movies$: any[] = [];
	observer$!: Observer<any>;
	searchTerm: string = "";
	searchFilter: string = "title";
	isOverlayVisible: boolean = false;

	//INFINITE SCROLL
	throttle = 300;
	scrollDistance = 1;
	scrollUpDistance = 2;
	direction = "";
	modalOpen = false;
	start: number = 0;
	sum: number = 10;

	constructor(private api: ApiService, private cache: LocalStorageService) {}

	getArray(): void {
		//testing method
		console.log("response$: ", this.response$);
		console.log("movies$", this.movies$);
		this.getMostPopular();
	}

	ngOnInit(): void {
		this.isDataReady = false;
		if (this.cache.get("mostPopular")) {
			//reset ngfor infinite scroll
			this.movies$ = [];
			this.start = 0;
			this.sum = 10;
			this.response$ = _.toArray(this.cache.get("mostPopular"));
			this.addItems(this.start, this.sum, this.response$);
		} else {
			this.getMostPopular();
		}
		this.isDataReady = true;
	}

	addItems(index: number, sum: number, response: any[]) {
		for (let i = index; i < sum; ++i) {
			this.movies$.push(response[i]);
		}
		console.log(this.movies$);
	}

	onScrollDown() {
		if (this.movies$.length >= 100) return;
		this.start = this.sum;
		if (this.movies$.length === 90) this.sum += 10;
		else this.sum += 20;
		this.addItems(this.start, this.sum, this.response$);
		this.direction = "down";
	}

	getMostPopular() {
		this.api.mostPopular().subscribe(
			data => {
				console.log(data.items);
				this.response$ = data.items;
				this.cache.set("mostPopular", data.items);
				this.addItems(this.start, this.sum, this.response$);
			},
			err => {
				console.log(err.errorMessage);
			}
		);
	}

	getMovieDetail(id: any): void {
		if (!this.cache.get(id) || this.movie?.id != id) {
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
						this.cache.set(id, this.movie);
					});
				});
		} else {
			this.movie = this.cache.get(id);
		}
		this.isOverlayVisible = true;
	}
	hideOverlay(bit: boolean): void {
		if (bit) this.isOverlayVisible = false;
	}

	featured: Array<string> = [
		"01.webp",
		"02.webp",
		"03.webp",
		"04.webp",
		"05.webp",
		"06.webp",
		"07.webp",
		"08.webp",
		"09.webp",
		"10.webp",
		"11.webp",
		"12.webp",
		"13.webp",
		"14.webp",
	];
}
