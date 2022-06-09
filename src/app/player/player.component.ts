import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
@Component({
	selector: "app-player",
	templateUrl: "./player.component.html",
	styleUrls: ["./player.component.css"],
})
export class PlayerComponent implements OnInit {
	@Input() movie: any;
	videoUrl: string = "";
	sanitizedUrl: SafeResourceUrl = "";

	constructor(private sanitizer: DomSanitizer) {}

	ngOnChanges(changes: SimpleChanges) {
		if (changes["movie"]) {
			this.videoUrl =
				"https://www.youtube.com/embed/" +
				this.movie.videoId +
				"?&autoplay=1&mute";
			this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
				this.videoUrl
			);
		}
	}

	ngOnInit(): void {}
	ngOnDestroy(): void {}
}
