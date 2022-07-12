import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthResponse, Login, Register } from "../models/user.model";
import { LocalStorageService } from "./local-storage.service";
import { BehaviorSubject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	private JSON_SRV = "http://localhost:3000/";

	private isLoggedIn = new BehaviorSubject(false);
	authStatus = this.isLoggedIn.asObservable();

	constructor(private http: HttpClient, private ls: LocalStorageService) {}

	login(model: Login) {
		return this.http.post<AuthResponse>(this.JSON_SRV + "login", model);
	}

	getUser(): AuthResponse | null {
		if (this.ls.get("user")) {
			const user: AuthResponse = this.ls.get("user")!;
			return user;
		}

		return null;
	}

	register(model: Register) {
		return this.http.post<any>(this.JSON_SRV + "register", model);
	}

	patchUser(id: number, model: any) {
		const user = this.getUser();
		return this.http.patch<any>(this.JSON_SRV + "users/" + id, model, {
			headers: { Authorization: "Bearer " + user?.accessToken },
		});
	}

	putUser(id: number, model: any) {
		const user = this.getUser();
		return this.http.put<any>(this.JSON_SRV + "users/" + id, model, {
			headers: { Authorization: "Bearer " + user?.accessToken },
		});
	}

	changeStatus(bool: boolean) {
		this.isLoggedIn.next(bool);
	}
}
