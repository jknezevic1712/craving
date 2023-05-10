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

Pipes are applied generally from left-to-right so you may have to consider the ordering of the pipes if you chain multiple pipes together

# Interceptors

They are service-like class that implements HttpInterceptor that requires you to have intercept method that basically works like a middleware for each request sent, so Interceptor can intercept a request before it's sent and before you get a response.
Implementing them is done by adding them to app.module inside of providers like this:

`import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';`
`import { AuthInterceptorService } from './auth-interceptor.service';`

> // Ordering of the interceptors is important in some cases since the order defines which interceptor is executed first, second, etc.
> `imports: [..., HttpClientModule],`
> `providers: [`
> > `{`
> > `provide: HTTP_INTERCEPTORS,`
> > `useClass: AuthInterceptorService,`
> > `multi: true, // If you have multiple interceptors, you can pass this prop so that Angular doesn't overwrite other interceptors with this one`
> > `},`
> > `]`

Use case for interceptors is when you perhaps need to attach some custom headers to each request you make. Also, it's possible to modify the request object, it is immutable by itself but you can assign a clone of it to a variable and then modify it and handle it.
You also have to `return next.handle(req);` so that request can 'go on'.