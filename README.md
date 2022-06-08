# LabTV (Angular Project)

A streaming platform mockup commissioned by my web development school for an interim examination. It uses [IMDb-API](https://imdb-api.com/) to fetch movie information and [json-server](https://github.com/typicode/json-server) + [json-server-auth](https://github.com/jeremyben/json-server-auth#readme) to simulate a connection to a database.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.6.

> A patch to json-server to enable the [--no-delete-cascade](https://github.com/typicode/json-server/pull/756/files) flag is included and applied automatically.

##Website Structure

![LabTV Homepage](https://i.ibb.co/K24TPDh/labtv.jpg "LabTV Homepage")

#### Header
- A menu button revealing a sidebar with links. The working links are **Home** and **Ricerca** (search) . The **Guida TV** link actually clears the local storage;
- A central button that points home;
- A user section that opens the overlay to register/login. After logging in, the username is shown instead of the default text and a dropdown menu is enabled.

#### Homepage
- A banner carousel (made with [ng-bootstrap](https://ng-bootstrap.github.io/#/home));
- A list of 100 most popular movie cards with infinite scrolling (made with [ngx-infinite-scroll](https://github.com/orizens/ngx-infinite-scroll));
- A searchbar to filter cards by name, actor or year.

#### Search
- Can be accessed from the sidebar menu (**Ricerca**);
- Fetches movie information by title.

#### Movie Overlay
- Opens up when clicking on a movie card;
- Shows player, title information, action buttons (database integration) and a mock list of episodes;

#### Player
- Can be accessed from the movie overlay;
- Automatically plays the corresponding movie trailer from YouTube.

#### Registration/Login
- Can be accessed from the rightmost header section (**Accedi**);
- Features integration with *json-server-auth*;
- Logging in enables a dropdown menu that grants access to profile editing (**Profilo**), owned movies (**Catalogo**), liked movies (**Preferiti**) and logout (**Esci**).

#### Like and Buy a movie
- A logged user can either like and/or buy a movie from the action buttons in the movie overlay (integration with two independent *json-server* databases):
	- **Acquista** will add the movie to the user's catalogue (**Catalogo**);
	- **Restituisci** will remove the movie from the user's catalogue;
	- **Mi piace** (empty heart) will add the movie to the user's favourites (**Preferiti**);
	- **Mi piace** (full heart) will remove the movie from the user's favourites.

## Implemented Angular features
- Binding (interpolation, property binding, event binding, two-way binding);
- Structural directives (ngFor, ngIf, ngSwitch) and attribute directives (ngStyle, ngClass);
- Data sharing between Components (*Input*, *Output* and *EventEmitters* );
- Lifecycle hooks (*ngOnInit*, *ngOnDestroy*, *ngAfterView*, *ngOnChanges*);
- Routing;
- Services;
- Interfaces (models);
- HTTP Ajax calls to Web Services/external APIs (Observables);
- Template-driven form validation;
-  *rxjs* features like `pipe(map())` and response array modeling with [lodash](https://www.npmjs.com/package/lodash);
-  URI Sanification with *DomSanitizer*;
-  *BehaviourSubjects* to sync login status and watched/liked/owned content among components;
- Custom Pipes.

## Instructions
- Point your terminal to the project root and run `npm install` to download project dependencies;
> *json-server* will be automatically patched via a post-install script;
- Run `npm run start:server` to start json-server on port 3000.
- Run `ng serve --open` and let it build the project. Your browser will open and take you to the project page.

## Build
###Requirements
A build is also provided, but still requires [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install some dependencies to enable login and database features.
> If you don't install npm and/or project dependencies, the only features available will be Most Popular Movies (**Home**) and Search (**Ricerca**).

###Instructions
- Download the build and extract the archive;
- Open a terminal into the extracted folder and run `npm i json-server json-server-auth patch-package` (just once);
- Run `npx  patch-package` (just once);
- Run `npx json-server --no-delete-cascade --watch db/db.json -m ./node_modules/json-server-auth -r db/routes.json` (anytime you want to test the project);
- Run `index.html` on any local server (like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)).

## Troubleshooting
> Sometimes the website will stop showing cards and movie information. 

This is most likely due to [IMDb-API](https://imdb-api.com/)  key usage limit to 100 uses per day. This project comes with my own API key, but you can replace it with your own:
- [Register a new account](https://imdb-api.com/Identity/Account/Register) (it's free);
- Go to your [profile page](https://imdb-api.com/Identity/Account/Manage) and copy your API key;
- Open `src/app/services/api.service.ts` and replace the value for `myIMDbKey` with your own.

------------

###Credits
Icons: Uicons by Flaticon(https://www.flaticon.com/uicons)
Font: MADE Tommy by MadeType(https://www.behance.net/madetype)


