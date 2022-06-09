import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CatalogoComponent } from "./catalogo/catalogo.component";
import { HomeComponent } from "./home/home.component";
import { PreferitiComponent } from "./preferiti/preferiti.component";
import { SearchComponent } from "./search/search.component";

const routes: Routes = [
	{ path: "", component: HomeComponent },
	{ path: "home", component: HomeComponent, redirectTo: "" },
	{ path: "search", component: SearchComponent },
	{ path: "catalogo", component: CatalogoComponent },
	// {
	// 	path: "catalogo/:id",
	// 	component: CatalogoComponent
	// },
	{ path: "preferiti", component: PreferitiComponent },
	// {
	// 	path: "preferiti/:id",
	// 	component: PreferitiComponent
	// },
	{ path: "**", redirectTo: "" },
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			scrollPositionRestoration: "enabled",
		}),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
