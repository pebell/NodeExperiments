var Rx = require('rxjs')

// var clicks = Rx.Observable.interval(1000).take(10).do(x=>console.log('starting thread',x));
// var ho = clicks.exhaustMap((ev)=>Rx.Observable.interval(500).take(5).do(x=>console.log('got: ',ev,x)));
// ho.subscribe(console.log);


// var clicks = Rx.Observable.interval(1000).take(10).do(x=>console.log('starting thread',x));
// var ho = clicks.map(ev=>Rx.Observable.interval(500).take(5).do(x=>console.log('got: thread',ev,'#',x)));
// var result = ho.exhaust();
// result.subscribe(console.log);


// var clicks = Rx.Observable.interval(500).take(10).do(x=>console.log('starting thread',x));
// var result = clicks.debounce(() => Rx.Observable.timer(400));
// result.subscribe(x => console.log(x));

// var clicks = Rx.Observable.interval(1000).take(10).do(x=>console.log('starting thread',x));
// var result = clicks.debounceTime(1100);
// result.subscribe(x => console.log(x));

// var clicks = Rx.Observable.interval(1000).map(x=>x*1).take(4);
// var ho = clicks.map(ev=>Rx.Observable.interval(500).map(x=>ev+'.'+x).take(5));
// ho.mergeAll().subscribe(console.log)

var clicks = Rx.Observable.interval(1000).map(x=>x*1).take(4);
var ho = clicks.mergeMap(ev=>Rx.Observable.interval(500).map(x=>ev+'.'+x).take(5));
ho.subscribe(console.log)
