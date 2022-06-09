import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class LocalStorageService {
	constructor() {}

	set(name: string, data: any): void {
		localStorage.setItem(name, JSON.stringify(data));
	}
	get(name: string): any {
		return JSON.parse(localStorage.getItem(name)!);
	}
	clear(): void {
		localStorage.clear();
	}

	del(name: string): void {
		localStorage.removeItem(name);
	}
}
