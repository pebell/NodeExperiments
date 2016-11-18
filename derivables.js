let Rx = require('rxjs')

let Dv = require('derivable')
let atom = Dv.atom;
let derive = Dv.derive;
let transact = Dv.transact;

const name = atom("World"); 
const countryCode = atom("en"); 

const greetings = {
  en: "Hello",
  nl: "Hallo",
  es: "Hola",
  fr: "Bonjour"
};

const greeting = countryCode.derive(cc => greetings[cc]);

countryCode.react(msg => console.log("Atom 'countryCode' set to "+msg));
// greeting.react(msg => console.log("greeting set to "+msg));

const getDerivableObservable = function(myDerivable) {
  return Rx.Observable.create( function (observer) {
      const stopSignal = atom(false);
      myDerivable.react(val=>{ observer.next(val) }, {until: stopSignal});
      return function () {stopSignal.set(true)}
    });
}

const observable = getDerivableObservable(greeting);

observable.take(3).subscribe( 
  (x) => console.log('next: %s', x.login ? x.login : x) ,
  (e) => console.log('error: %s', e) ,
  () => console.log('completed') 
);


countryCode.set("nl")

countryCode.set("es")

countryCode.set("fr")

setTimeout(()=>{countryCode.set("en")},3000);


function erlangInterval(ratePerMinute)
{
  return (-1/ratePerMinute*Math.log(Math.random()))*60000;
}

Rx.Observable.prototype.naturalDelay = function (ratePerMinute) {
  return this.concatMap(u=>Rx.Observable.interval(erlangInterval(ratePerMinute)).take(1), u => u);
}

Rx.Observable.prototype.toAtom = function (toAtom) {
  return this.do(u=>toAtom.set(u), u => u);
}

const observable2 = Rx.Observable.of('en','nl','fr','es','nl').naturalDelay(60).take(3).toAtom(countryCode);

// observable2.subscribe( 
//   (x) => console.log('observable: %s', x.login ? x.login : x) ,
//   (e) => console.log('error: %s', e) ,
//   ()  => console.log('completed') 
// );

// setTimeout(()=>{countryCode.set("en")},3000);