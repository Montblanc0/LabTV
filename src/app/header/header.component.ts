import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { LocalStorageService } from "../services/local-storage.service";
import ReglogOverlayService from "../services/reglog-overlay.service";

@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
	@Output() showForms: EventEmitter<any> = new EventEmitter<boolean>();
	@Output() showProfile: EventEmitter<any> = new EventEmitter<boolean>();

	isLoggedIn: boolean = false;
	toggleNav: boolean = false;
	isSubMenuVisible: boolean = false;
	isDropDownVisible: boolean = false;
	headerText: string = "Accedi";

	constructor(
		private auth: AuthService,
		private ls: LocalStorageService,
		private router: Router,
		private emitter: ReglogOverlayService
	) {}

	ngOnInit(): void {
		this.auth.authStatus.subscribe(bool => {
			this.isLoggedIn = bool;
			if (this.isLoggedIn) {
				this.headerText =
					this.ls.get("user").user.username! || "Accedi";
			} else {
				this.headerText = "Accedi";
			}
		});
		//controllo user in LS al live reload di ng
		if (this.auth.getUser() && this.isLoggedIn == false)
			this.auth.changeStatus(true);
	}

	clearAll(): void {
		this.ls.clear();
		this.auth.changeStatus(false);
	}

	dropDownToggle(): void {
		this.isDropDownVisible = !this.isDropDownVisible;
	}

	logOut() {
		this.ls.del("user");
		this.auth.changeStatus(false);
		this.router.navigate([""]);
		this.emitter.refreshSignal(true);
	}

	openForms(): void {
		this.showForms.emit(1);
	}

	headerClick(): void {
		if (!this.isLoggedIn) this.openForms();
		else this.dropDownToggle();
	}

	openProfile(): void {
		this.showProfile.emit(1);
	}
}
