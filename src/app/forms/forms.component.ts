import { DOCUMENT } from "@angular/common";
import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnInit,
	OnDestroy,
	Output,
	Renderer2,
} from "@angular/core";
import { Subscription } from "rxjs";
import { Login, Register, User } from "../models/user.model";
import { AuthService } from "../services/auth.service";
import { LocalStorageService } from "../services/local-storage.service";
import * as _ from "lodash";
import * as $ from "jquery";
import ReglogOverlayService from "../services/reglog-overlay.service";

@Component({
	selector: "app-forms",
	templateUrl: "./forms.component.html",
	styleUrls: ["./forms.component.css"],
})
export class FormsComponent implements OnInit, OnDestroy {
	constructor(
		private auth: AuthService,
		private ls: LocalStorageService,
		@Inject(DOCUMENT) private document: Document,
		private renderer: Renderer2,
		private emitter: ReglogOverlayService
	) {}

	@Input() isRegLogVisible = false;
	@Input() isProfileVisible = false;
	@Output() hideForms: EventEmitter<any> = new EventEmitter<boolean>();

	subscription!: Subscription;
	isLoggedIn: boolean = false;
	isProfPage2Visible = false;
	errorMessage: string = "";
	hasAccount: boolean = true;
	isEmailInvalid: boolean = false;
	isPasswordInvalid: boolean = false;
	isRememberChecked: boolean = false;
	isPolicyAccepted: boolean = false;
	passRepeat: string = "";
	changePassword: string = "";

	logModel: Login = { email: "", password: "" };
	regModel: Register = { email: "", password: "", username: "" };
	userModel: User = {
		id: NaN,
		username: "",
		name: "",
		surname: "",
		password: "",
		email: "",
		tel: "",
		bio: "",
	};
	userDB!: User;

	ngOnInit(): void {
		this.renderer.addClass(this.document.body, "no-scroll");
		this.subscription = this.auth.authStatus.subscribe(
			bool => (this.isLoggedIn = bool)
		);

		//se user è loggato, recupera i dati e popola il form del profilo
		if (this.auth.getUser()) {
			this.userModel = this.ls.get("user").user;
			//copia l'utente dal localstorage in userDB per confronto template value
			this.userDB = { ...this.userModel };
		}
	}

	ngOnDestroy(): void {
		this.renderer.removeClass(this.document.body, "no-scroll");
		this.subscription.unsubscribe();
	}

	toggleRegLog(): void {
		this.errorMessage = "";
		this.hasAccount = !this.hasAccount;
	}

	login(): void {
		this.errorMessage = "";

		console.log(this.logModel);
		this.auth.login(this.logModel).subscribe(
			res => {
				console.log(res);
				console.log("Login Submitted");
				this.ls.set("user", res);
				this.finalizeLogin();
			},
			err => {
				console.log(err);
				if (err.status == 0) {
					this.errorMessage = err.name;
				} else this.errorMessage = err.error;
			}
		);
	}

	register(): void {
		this.errorMessage = "";
		this.regModel.username = this.regModel.email.substring(
			0,
			this.regModel.email.indexOf("@")
		);
		console.log(this.regModel);
		this.auth.register(this.regModel).subscribe(
			res => {
				console.log(res);
				console.log("Register Submitted");
				this.ls.set("user", res);
				this.finalizeLogin();
			},
			err => {
				console.log(err);
				if (err.status == 0) {
					this.errorMessage = err.name;
				} else this.errorMessage = err.error;
			}
		);
	}

	finalizeLogin() {
		this.auth.changeStatus(true);
		this.closeForms();
		this.emitter.refreshSignal(true);
	}

	logOut() {
		this.ls.del("user");
		this.closeForms();
		this.auth.changeStatus(false);
		this.emitter.refreshSignal(true);
	}

	aggiornaProfilo(): void {
		this.errorMessage = "";
		console.log("Ingresso Submit Profilo");

		if ($("#profwrap span.hidden").length !== 8)
			this.errorMessage = "Correggi gli errori evidenziati";
		if (this.errorMessage != "") return;

		//Inizio controllo modifiche
		const lsUser: any = this.auth.getUser()?.user;

		console.log("this.userModel iniziale:");
		console.log(this.userModel);
		console.log("lsUser iniziale:");
		console.log(lsUser);
		//creo un array che conterrà una lista delle key modificate o aggiunte
		let changes: any[] = [];
		changes = this.getObjectDiff(this.userModel, lsUser);
		console.log(changes);
		//Se l'utente non ha effettuato modifiche o aggiunte, ritorna
		if (_.isEmpty(changes)) {
			console.log("no change");
			this.closeForms();
			return;
		}
		//Crea un payload da inviare al server
		const payload = {};
		//copio this.userModel in oggetto iterabile
		const userModel: any = this.userModel;
		console.log(userModel);

		//copia ogni (key, value) modificata/aggiunta in payload
		_.forEach(changes, item => {
			if (userModel.hasOwnProperty(item) && userModel[item]) {
				console.log("has " + item + "!");
				_.set(payload, item, userModel[item].trim());
			}
		});
		//ulteriore controllo sull'integrità del payload
		if (_.isEmpty(payload)) {
			console.log("no change");
			this.closeForms();
			return;
		}
		console.log("payload dopo i controlli");
		console.log(payload);

		//invia le modifiche al server
		const id = lsUser.id;

		this.auth.patchUser(id, payload).subscribe(
			res => {
				console.log(res);
				console.log(
					"Modifiche effettuate con successo, ripeti il login"
				);
				this.logOut();
			},
			err => {
				console.log(err);
				if (err.error == "jwt expired") {
					console.log("token scaduto, logout automatico");
					this.logOut();
				} else this.errorMessage = err.error;
				return;
			}
		);
		console.log("Fine Submit Profilo");
	}

	closeForms(): void {
		this.hideForms.emit(1);
	}

	getObjectDiff(obj1: any, obj2: any) {
		const diff = Object.keys(obj1).reduce((result, key) => {
			if (!obj2.hasOwnProperty(key)) {
				result.push(key);
			} else if (_.isEqual(obj1[key], obj2[key])) {
				const resultKeyIndex = result.indexOf(key);
				result.splice(resultKeyIndex, 1);
			}
			return result;
		}, Object.keys(obj2));
		return diff;
	}
}
