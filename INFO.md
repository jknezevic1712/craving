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
