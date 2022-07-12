import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
	providedIn: "root",
})
// Servizio utilizzato per mettere in comunicazione componenti senza relazione padre-figlio (forms e overlay)
export default class ReglogOverlayService {
	constructor() {}

	//Segnale overlay -> forms per far aprire i form
	private opener = new BehaviorSubject<boolean>(false);
	//Viene osservato da app-component
	opener$ = this.opener.asObservable();
	//Viene inviato da overlay
	openSignal(change: boolean) {
		this.opener.next(change);
	}

	//Segnale form -> overlay per refreshare il component
	private refresher = new BehaviorSubject<boolean>(false);
	//Viene osservato da overlay
	refresher$ = this.refresher.asObservable();
	//Viene inviato da forms
	refreshSignal(change: boolean) {
		this.refresher.next(change);
	}
}
