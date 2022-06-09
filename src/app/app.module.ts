import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { PlayerComponent } from "./player/player.component";
import { FormsComponent } from "./forms/forms.component";
import { HomeComponent } from "./home/home.component";
import { HttpClientModule } from "@angular/common/http";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { OverlayComponent } from "./overlay/overlay.component";
import { FilterPipe } from "./filter.pipe";
import { FormsModule } from "@angular/forms";
import { SliderComponent } from "./slider/slider.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SearchComponent } from "./search/search.component";
import { CatalogoComponent } from "./catalogo/catalogo.component";
import { PreferitiComponent } from "./preferiti/preferiti.component";
@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		FooterComponent,
		PlayerComponent,
		FormsComponent,
		HomeComponent,
		OverlayComponent,
		FilterPipe,
		SliderComponent,
		SearchComponent,
		CatalogoComponent,
		PreferitiComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		NgbModule,
		InfiniteScrollModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
