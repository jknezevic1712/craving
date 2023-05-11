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

# Observables

They are various data sources, such as: (User Input) Events, Http Requests, Triggered in Code, ...
There are three ways of handling data packages: Handle Data, Handle Error and Handle Completion (of observable). You write the code which gets executed.

So, observable emits some data which observers receives or subscribes to.

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