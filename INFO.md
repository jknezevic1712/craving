# What are "Modules" (ngModule)

1. AppModule
   1. AppComponent
   2. ProductsComponent
   3. HighlightDirective
   4. ProductsService

Angular analyzes NgModules to "understand" your app and its features while also defining all building blocks the app uses: Components, Directives, Services.
App requires at least one module (AppModule) but may be split into multiple modules.
Core Angular features are included in Angular modules (e.g. FormsModule) to load them only when needed.
Also, you cannot use a feature/building block without firstly including it in a module.

## Working with multiple Modules

You can split your AppModule into smaller modules (feature modules) that can make your AppModule leaner while you group together related components, directives, pipes, etc. into one separate Module.

Example:

1. AppModule
   1. AppComponent
   2. ProductListComponent
   3. ProductComponent
   4. OrdersComponent
   5. HighlightDirective


Into:

1. AppModule
   1. AppComponent
2. ProductsModule
   1. ProductListComponent
   2. ProductComponent
3. OrdersModule
   1. OrdersComponent
   2. HighlightDirective


## Shared Modules

In a case where you have split your AppModule into multiple separate Modules and in each of those you have a few Modules imported that are the same in all of them you can create a Shared Module that would import all those duplicate Modules and export them so that we can import one Module instead of duplicating the imports.

## CoreModule

CoreModule makes the AppModule a bit leaner, so in case if you had a situation like this:

1. AppModule
   1. AppComponent
   2. ProductsService
   3. AnalyticsService

You can turn this into this:

1. AppModule
   1. AppComponent
   2. CoreModule
2. CoreModule
   1. ProductsService
   2. AnalyticsService

Ofcourse, if you use { providedIn: 'root' } inside of @Injectable, then you don't have services added to the providers array so you have no need to do this.

## Lazy Loading

Loading Modules "on demand" meaning that if we have AppModule for /, ProductsModule for /products and AdminModule for /admin, we load the Modules (download the code) when we need it, so when we are on a specific route related to a certain Module.

In order to use this feature, you should have feature Modules together with their own routes inside of them.

How to implement:

1. Inside of your feature Module routing, make your path an empty string, so from e.g. path: 'auth' => path: ''
2. Inside of app-routing, so your main routing Module, write following:

  `{`
    `path: 'auth',`
    `loadChildren: () =>`
      `import('./auth/auth.module').then((mod) => mod.AuthModule),`
  `}`
  
3. Inside of your app.module.ts, remove the feature Module import so that it doesn't get included inside of the main.js bundle

### Preloading strategy

You can preload some feature Modules by either defining your custom preloading strategy so that only certain feature Modules get preloaded or you can provide PreloadAllModules which will preload all Modules but I'm not too sure how does this help with downloading less code.
Adding preloading strategy inside of app-routing.module.ts:

`RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })`

### Services and Modules

You can provide services by adding them in:

1. AppModule (either in providers array or inside of @Injectable by adding { providedIn: 'root' })
   1. Service available app-wide because root injector is used
   2. Best thing would be to provide services globally unless you have a case where a Component needs to have its own service/instance because the service is perhaps irrelevant for other Components
2. AppComponent(or other Components)
   1. Service is available in component-tree because component-specific injector is used
   2. Provide services here only if the service is relevant only for this component-tree and the rest of the Components doesn't care about it
3. Eager-loaded Module
   1. Service available app-wide because root injector is used
   2. Providing services here should be avoided since the effect is the same as providing them inside of AppModule but it's harder to detect that a service was provided here and can lead to unexpected behavior or confusion for other devs.
4. Lazy-loaded Module
   1. Service available in loaded module with its own instance because child injector is used
   2. You can provide service here only if you require to have a separate instance of that service in this Module

Important note is that, in case you have a SharedModule that you import in a lazy-loaded module and inside of eagerly-loaded module, that SharedModules' services will have separate instances for each those Modules since importing SharedModule inside of lazy-loaded module will make this SharedModule lazy-loaded module as well.

# Observables

They are various data sources, such as: (User Input) Events, Http Requests, Triggered in Code, ...
There are three ways of handling data packages: Handle Data, Handle Error and Handle Completion (of observable). You write the code which gets executed.

So, observable emits some data which observers receives or subscribes to.

NOTE ABOUT OBSERVABLES
If you create your own observable, you NEED TO UNSUBSCRIBE in ngOnDestroy since when you use your own custom observables, Angular won't "clean up" automatically

E.g. this.route.params.subscribe(...), here, params is observable to which we can subscribe to allowing us to have a reactive template changes

subscribe() can take up to three anonymous functions as params:

1. first one is next() handler that is used to do something with the data you get from the observable or from observer.next(_data_) if you create a custom observable,
2. second one is error() handler that you use to do something when you get an error, e.g. http req failed, or you used observer.error(...) inside of your custom observables' next() handler
3. third one is complete() handler that can perform an action you want when the observable is completed, meaning it "completed" its' purpose, e.g. an http req was done successfully, or you used observer.complete() inside of your custom observables' next() handler

## Operators

They are used to modify the data before they are delivered to the observer. You can filter, map, etc. and the way you do it is by using .pipe() before .subscribe().
Inside of pipe(), you can insert imported functions, from rxjs/operators, such as map, filter and so on into which you insert anonymous function in order to modify the data. E.g. pipe(map(data => { ... })).subscribe(...)

## Subjects

Subjects are a "more active" Observables since you can actively call next() on it from outside so Observable is "passive" in a way that it wraps a callback, event, etc. and Subject can be triggered from code, e.g. when you want to trigger an event yourself by clicking a button or something.
They are similar to EventEmmitters but they are a more efficient solution because of how they work "behind the scenes", although, you would use Subjects only when you need cross-component communication through services, they are not usable when you use EventEmitter for @Output.
You use them similarly to EventEmitters, but instead of using .emit(), you use next() since it's and observable.
IMPORTANT: you need to unsubscribe in onDestroy since the Angular won't do it on its' own.

Defining them is almost the same as an EventEmitter:

1. activatedEmitter = new EventEmitter<boolean>();
2. activatedEmitter = new Subject<boolean>();

# Pipes

They are used to transform an output.

E.g., you are using .subscribe() method to get data and you can transform that data by using .pipe().subscribe(...) where, inside of pipe(), you can provide many different functions to transform the data, such as filter, map, etc.

map() pipe automatically wraps what you return in an observable.

## Built-in pipes

For example you have username = 'Max' and you output it with string interpolation {{ username }}, but you want it to be uppercase only when you render it to the screen.
Here you can use built-in pipe such as {{ username | uppercase }}

Pipes are applied generally from left-to-right so you may have to consider the ordering of the pipes if you chain multiple pipes together.

# Interceptors

They are service-like class that implements HttpInterceptor that requires you to have intercept method that basically works like a middleware for each request sent, so Interceptor can intercept a request before it's sent and before you get a response.
Implementing them is done by adding them to app.module inside of providers like this:

`import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';`

`import { AuthInterceptorService } from './auth-interceptor.service';`

* Ordering of the interceptors is important in some cases since the order defines which interceptor is executed first, second, etc.
`imports: [..., HttpClientModule],`
  `providers: [`
    `{`
      `provide: HTTP_INTERCEPTORS,`
      `useClass: AuthInterceptorService,`
      * If you have multiple interceptors, you can pass this prop so that Angular doesn't overwrite other interceptors with this one
      `multi: true,`
    `},`
  `]`

Use case for interceptors is when you perhaps need to attach some custom headers to each request you make. Also, it's possible to modify the request object, it is immutable by itself but you can assign a clone of it to a variable and then modify it and handle it.
You also have to `return next.handle(req);` so that request can 'go on'.

# Dynamic Components

They are basically components that get rendered "on demand", so when something specific happens in our code. Example would be toasts, alert popups, etc.
You use them same as other components but you control their render by using structural directive *ngIf.

Old way of doing this (no longer exists) was using 'Dynamic Component Loader' but it does exists as general concept meaning that you create a component in code and then manually attach it to the DOM. So, by doing this, you have to control in the code by yourself how that component is instantiated, how the data is passed into it and also how is the component removed.
This means that you don't touch the template but you do everything in the code.

# Standalone Components vs NgModules (quote from Max 'Angular - The Complete Guide')

Angular 14 introduced standalone components in "Preview Mode". With Angular 15, this feature now became stable (the syntax didn't change though).

You may now use standalone components instead of NgModules in production-ready apps. And, as will be shown throughout this section, you can also mix and match the concepts as needed.

But should you use standalone components in all scenarios?

Well, for the moment, that's probably a "No". Especially for large, very complex applications, NgModules reduce the amount of boilerplate code (imports etc.) that needs to be written. NgModules can also help with structuring dependency injection, bundling features together and more.

But this may change in the future, as Angular continues to evolve and new patterns may emerge.

# Classic Change Detection vs Signals

New way of handling data changes and of updating the UI.

## Classic Change Detection

Classic Change Detection (Zone-based Change Detection - uses library zone.js) is looking at our properties we defined and output in the template and when the data changes, UI gets refreshed with the new data.
So, changes are detected automatically and the UI is also updated automatically.

Problem with this approach is that the overall app performance could be better and the bundle size could be smaller. This is due to Angular using zone.js for change detection which means that Angular is constantly watching all changes and checking all our data and updating UI whenever a change occurs.

## Signals

By using only signals, you don't use zone.js which leads to reduced bundle size as well as Angular not watching our entire app that leads to better performance and smaller bundle.
The thing is, with signals we "tell" Angular when data changes so that Angular can know which parts of the UI needs to be updated when the related data changes.

With slightly more work, advantages are full control, better performance and smaller bundle size.

### Signal updating

1. Set() -> does not provides as with old value as an arg, but we still can access the counter signal value
2. Update() -> uses anonymous function that provides old value as an arg, so we are, as we did with set(), assigning a new value to this signal
3. Mutate() -> similar to update method that's meant to be used for values that can be mutated because for example numbers cannot since you can override a number with a new one, but you can't change an existing number. So mutate() is technically also assigning a new value but by   editing an existing value.

### computed()

computed() -> exists to give you an easy way of creating computed values, so values that depend on other values. E.g.:

`counter = signal(0);`

`doubleCounter = computed(() => this.counter() * 2);`

Here, doubleCounter would be updated by Angular only whenever this counter signal would change.
Also, in your template you would output this doubleCounter as a signal, so doubleCounter().

### effect()

Similar to useEffect() hook in React, works with signals. For example:

`constructor() {`
   `effect(() => console.log(this.counter()));`
`}`

Here effect would run the code defined in it every time this.counter signal changes.

# NgRx (Redux)

State managment solution by Angular team, basically React Redux Angular implementation.

It's an alternative to using services, components and subjects to manage app state, although this approach can work generally for smaller and simpler apps that don't have a ton of components depending on the same data, etc.

## Side effects with NgRx (@ngrx/effects package)

Side effects are parts of the code that run some logic that is not that important that it would require immediate update of the current state.

Important note about switchMap(), it must return a non error observable, also, in order to catch errors and such, you have to call pipe on the inner observable.

# Service workers

## What are they?

Normally, JS code runs in a single thread which means that our web app that can consist of multiple pages(MPA) or one page(SPA).

Now, JS and browser also offers us to run an additional thread and there we can run a so-called web worker that has a special form we can use and that is the service worker.
Since this thread is decoupled from our HTML pages, it can run in the background, for example mobile browser typically offer this on our mobile phones. With this, we can receive push notifications and such.

Other important thing a service worker can do is manage all our different pages or a single page, it can listen to outgoing network requests so that when we're fetching something, he can catch these outgoing requests and do something with them.
He can cache the responses in a special cache storage and then return them to our page so that our page work offline. This includes CSS code, fonts, JS code, API data, etc.
Service worker can also proxy the requests (so cache them), do something with them and then proceed to allow/disallow them to go on and leave the app.

## Installing it

Run 'ng add @angular/pwa' and type 'y' if it asks you to configure everything.

If you need a lightweight node server, you can install 'npm i -g http-server' that you can use to run your code and simulate service worker environment.

# Unit Testing

## Functions & Features

### detectChanges()

This means that the test below will try to access apps' user.name after the properties of the UserComponent have been updated:

>fixture.detectChanges();

### nativeElement

With it we get access to the compiled template:

>let compiled = fixture.debugElement.nativeElement;

### whenStable()

Resume test when all async tasks are finished

>fixture.whenStable().then(() => {
>>expect(app.data).toBe('Data');
>});

### spyOn()

Listens to getDetails function from dataService and whenever it gets executed when running a test, it won't execute it and will instead return a value on our own

### tick()

Simulate passage of time, so when you call tick() it means that all async tasks are finished now and the test can move on

## Isolated and Non-Isolated Tests

Isolated tests are when you don't need or don't have a dependency on Angular or other pieces in the app then you don't need to import Angular features such as TestBed, etc.
Example of this is ReversePipe that just reverses a string and for that you don't depend on any Angular features hence you don't need them and you can write the test like this:

import { ReversePipe } from './reverse.pipe';

>describe('ReversePipe', () => {
>>it('should reverse the value', () => {
>>>let reversePipe = new ReversePipe();
>>>
>>>expect(reversePipe.transform('hello')).toEqual('olleh');
>>});
>});

Non-Isolated Tests use testing features Angular provides and look like this:

>import { TestBed } from '@angular/core/testing';
>import { UserComponent } from './user.component';
>
>describe('UserComponent', () => {
>>
>>beforeEach(() => {
>>>TestBed.configureTestingModule({
>>>>declarations: [UserComponent],
>>>});
>>});

>>it('should create the app', () => {
>>>let fixture = TestBed.createComponent(UserComponent);
>>>let app = fixture.debugElement.componentInstance;
>>>
>>>expect(app).toBeTruthy();
>>});
>});

# Angular CLI and config files

## .editorConfig

Picked by IDEs to tell them how to format the files, overrides your or IDEs' default settings

## angular.json

Inside of here you can set some defaults for flags used by Angular CLI.

### projectType

Used to describe if the project is a web app or a library

### schematics

Blueprints which certain Angular commands can pick up.
Examples of this would be that we have schematics for ng generate to generate new building blocks in our app, we could also have schematics for ng add to add libraries or certain capabilities to a project, ng update is also an example of this to keep our project up-to-date.

We can build our own schematics to maybe, with our own ng generate command, generate a specific version of a component that we need all the time.

### root

What is the root folder of this project

### sourceRoot

Where is our source code

### prefix

Default prefix used when generating components

### architect

Contains options for build, serve and other commands. You can also specify your custom commands

## browserslist

Config file picked up by Angular CLI when you build your project for production and it tells CLI which browsers you want to support with your project.
So basically, when you tell your browser that you want to support IE 9-11 for example, CLI will then use that info to adjust your CSS styles and add prefixes to them to support IEs'.
Also, it tells CLI to load the correct polyfills and create the right code bundles that include those polyfills.

Important to note here is that you want to be restrictive as possible and not as open as possible which means that if you don't have to support IEs' for example then don't, because it will reduce the amount of the code users have to download.

## karma.conf.js

Used for unit testing because Angular CLI uses Karma behind the scenes for testing.

## package.json

### dependencies

Holds packages required to build the app and run successfully.

### devDependencies

These dependencies are used during the development of our app and are not to be included in the final build of our app that ships to our users.

## tsconfig.json

Used to define how Typescript will "look" at our code or to define some other properties.

tsconfig.app/spec.json are extending the main config for either testing or production purposes.

### angularCompilerOptions

This is a property in tsconfig.json that is picked by the Angular compiler and is not the TS compiler which is the compiler that kicks in after the TS compiled the code to JS. Angular compiler will then compile the app, add compiled JS code, HTML templates, event listeners, etc. and you can configure that inside of this property.


## tslint.json

Linter, checks code quality and tells you whether you're following best practices.
The errors are not real errors, just potential improvement recommendations.

## Angular CLI commands

ng serve - serves your code on localhost
ng add - used to add libraries/packages to our project
ng generate - used to generate various things, such as components, guards, pipes, directives, etc. E.g. (ng generate @angular/material:nav main-nav), by using this command CLI will generate nav component inside of main-nav folder
ng lint - ESLint (defaultly used by Angular) goes through your code and check for linting errors
ng build - builds our source files to a dist folder, you can optionally pass --prod to have your code optimized as much as possible
ng update - analyzes project deps to check if something needs to be updated, it also tells you how to update and what commands to run to do so, etc.

## Builders

There are some built-in builders such as ng build, ng test or ng lint.
They execute our code, compile it, analyze it and optimize for production, run test on it or they can tell us how good is our code quality.

ng deploy - a builder that will build our project for production and also deploy it to a certain host that is supported.

All of these are called automatization commands that we can customize by either writing our own builder or deployment builder (advanced) or by hooking into the config and adjusting them.

You can always deploy the app yourself or you can utilize deploy command to deploy the app to one of the supported hosts if you plan on using on of those.

## Differential Loading

For example, if we're hosting our app on some hosting provider and User A visits our app using a modern browser, he needs no/less polyfills hence the smaller bundle is required. In a different sitation we would have User B visiting via legacy browser, he would need all/more polyfills which means that a bigger bundle is required.

Differential loading comes handy in this case where Angular CLI will produce multiple versions of our app (depending on which browsers we opt in to support inside of browserlist file).
So, when a user visits our page, a small code file (runtime file) will be downloaded by user to determine what browser is the user using so that Angular can know which bundle is required for the app to work.

With this, the user using a modern browser will require a smaller bundle than a user using a legacy browser.

Beware that if you plan on using some features such as animations, you may need to install additional packages and import them in polyfills.ts (Inside of polyfills.ts you can find more information on this)

## Multiple projects

### Adding a new application to the existing workspace

By running `ng generate application app-name`, you can generate a new project that will be located inside of projects folder where you essentially then have two projects in one workspace.
Additionally, if you want to run a certain project from your workspace, run command `ng serve --project=app-name`.

It is also possible to define what will be the default project that will be served when using `ng serve` by editing defaultProject property inside of angular.json file.

### Creating a new workspace with no default application

You can achieve this by running `ng new no-default-app --create-application=false` where you will have no src folder, so only dependencies are installed.
Now, if you run `ng generate application app-name`, you will then have a cleaner structure because all of your projects will be located inside of the projects folder since the folder structure is not great if you add a new project to an existing workspace.

### Generating libraries

Libraries are meant to be shared among other apps, meaning that they are not meant to be run standalone as a web app, but rather to "supplement" an app.
They can still have their own components, they can be grouped with modules or they could have directives, etc.

To create a library, run `ng generate library my-button` command.

These libraries can be shared across our own Angular apps or we can also publish them to npm.

# Angular Elements

Feature of the Angular framework that allows you to turn your normal Angular components, that you use in your Angular app, into native web components.
Web components are basically custom HTML elements, they are a part of the DOM of the JS API, so they're not related to Angular and you could use them in vanilla JS apps or in apps built with other frameworks.

These components are useful for laoding dynamic content, so if you have a content management system on your backend ona server and there the editors can create HTML code, but you also want to enable them to also use some of your Angular components in the HTML code they prepare. If they would do that, use Angular component selectors, and then we would load this content dynamically, it would not work because Angular app is compiled ahead of time or even with just in time compilation, it's compiled before the content is loaded.

Example:

html file ->

<div [innerHTML]="content"></div>

ts file ->

export class AppComponent {
  content: string | null = null;

  constructor() {
    // Simulating async task
    /*

    Using our own component like this will not work because Angular will not consider this after it has loaded our app because the compilation of the templates,
    and therefore the part where it understands your component selectors is already done by that point of time.

    */
    setTimeout(() => {
      this.content = "<app-alert message='Rendered dynamically'></app-alert>";
    }, 1000);
  }
}

Angular has a way of basically taking our Angular component and putting it into a totally encapsulated self bootstrapping HTML element which you can dump into your Angular app.
This is done by installing `npm i --save @angular/elements` library and using `createCustomElement`.

In case of errors or if you're using an older version of Angular, you may need to also install `npm i --save @webcomponents/custom-elements` polyfill. You also need to import it inside of polyfills.ts file, the required imports should be defaultly commented out so you can just uncomment them.

If we try to do this now:

export class AppComponent {
  content: any;

  constructor(injector: Injector) {
    const AlertElement = createCustomElement(AlertComponent, {
      injector: injector,
    });

    customElements.define('my-alert', AlertElement);

    setTimeout(() => {
      this.content = "<my-alert message='Rendered dynamically'></my-alert>";
    }, 1000);
  }
}

Now, the above example will not work because we are trying to insert our HTML code through innerHTML property and therefore the security mechanism of the browser will sanitize/strip that HTML code out of our app in order to prevent cross site scripting attacks.
In order to get around this, we have to inject DomSanitizer object or class and wrap our custom HTML code with it so that the browser knows this code is safe:

export class AppComponent {
  content: any;

  constructor(injector: Injector, domSanitizer: DomSanitizer) {
    const AlertElement = createCustomElement(AlertComponent, {
      injector: injector,
    });

    customElements.define('my-alert', AlertElement);

    setTimeout(() => {
      this.content = domSanitizer.bypassSecurityTrustHtml(
         "<my-alert message='Rendered dynamically'></my-alert>"
      );
    }, 1000);
  }
}