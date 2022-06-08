import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "filter",
	// pure: false,
})
export class FilterPipe implements PipeTransform {
	transform(value: any[], field: string, searchTerm: string): any[] {
		if (!field) return value;

		if (!searchTerm) return value;

		return value.filter(
			x => x[field].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
		);
	}
}
