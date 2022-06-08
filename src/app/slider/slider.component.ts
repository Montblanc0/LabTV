import { Component, Input, OnInit } from "@angular/core";

@Component({
	selector: "app-slider",
	templateUrl: "./slider.component.html",
	styleUrls: ["./slider.component.css"],
})
export class SliderComponent implements OnInit {
	@Input() featured!: Array<string>;
	pics!: String[];

	constructor() {}

	ngOnInit(): void {
		this.pics = this.featured.map(pic => `assets/pics/featured/${pic}`);
	}
}
