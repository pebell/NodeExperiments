let fetch = require('node-fetch');
let HPA = require('https-proxy-agent');
let Rx = require('rxjs');
let Math = require('mathjs')

let agent = new HPA('http://proxy.ontwikkel.local:8080');

function getJSON(url) {
  console.log('GET JSON', url)
  return fetch(url, { agent })
    .then(r => { 
      if (r.status !== 200) { 
        return Promise.reject(r);
      } else {
        return r.text();
      }
    })
    .then(JSON.parse);
    // .catch(e => console.log(e));
}

function getUsers( callback ) {
  return getJSON('https://api.github.com/users').then(json=>callback(json));
}

//getUsers(json=>{Promise.all(json.map(user=>new Promise(){}))})


function constantInterval(ratePerMinute)
{
  return 60000/rate;
}





function getUserObservable()
{
  return Rx.Observable.create(function (observer) {
    getJSON('https://api.github.com/users').then(json=>{json.forEach((u,i)=>{setTimeout(()=>{observer.next(u)},i*Math.random()*2000) });   }).catch(e=>{console.log(e);observer.onError(e)}).then(()=>{observer.onCompleted()});
  });
}  



function getFastUserObservable()
{
  return Rx.Observable.create(function (observer) {
    getJSON('https://api.github.com/users').then(json=>{json.forEach((u,i)=>{observer.next(u)}); observer.complete() } );
  });
}  

//let observable = getFastUserObservable();

function getDelayedUserObservable(intervalFunc)
{
  return Rx.Observable.create(function (observer) {
    getJSON('https://api.github.com/users')
        .then(json=>{return json.reduce((prevtime,u)=>{ var newtime=prevtime+intervalFunc(); setTimeout(()=>{observer.next(u)},newtime); return newtime},intervalFunc()); })
        .then(endtime=>console.log('Total Running Time: '+Math.round(endtime/1000,2)))
        .catch(e=>{ console.log(e); observer.onError(e) })
        .then(()=>{observer.onCompleted()});
  });
}


function getDelayedUserObservable2(ratePerMinute)
{
  return getFastUserObservable().concatMap(u=>Rx.Observable.interval(erlangInterval(ratePerMinute)).take(1), u => u)
}

// let observable = getDelayedUserObservable2(60);

// let observable = getDelayedUserObservable(erlangInterval.bind(this,60));


function getRandomIntervalsObservable(ratePerMinute)
{
  return Rx.Observable.create(function (observer) {
    function nextItem(cnt)
    {
      if (!observer.isStopped && !observer.closed)
      {
        var nexttime = erlangInterval(ratePerMinute); 
        observer.next(cnt++)
        setTimeout(nextItem.bind(null,cnt),nexttime);
      }
    }
    nextItem(0);
  });
}


//let observable = getRandomIntervalsObservable(60).take(5);
// let observable = Rx.Observable.interval(1000).take(5).map();



function getDelayedObservable(arrayPromise,ratePerMinute)
{
  return Rx.Observable.create(function (observer) {
    arrayPromise
        .then(array=>{return array.reduce((prevtime,item)=>{ var newtime=prevtime+erlangInterval(ratePerMinute); setTimeout(()=>{observer.next(item)},newtime); return newtime},erlangInterval(ratePerMinute)); })
        .then(endtime=>{console.log('Total Running Time: '+Math.round(endtime/1000,2));setTimeout(()=>observer.complete(),endtime) })
        .catch(e=>{ console.log(e); observer.onError(e) })
  });
}

// let observable = getDelayedObservable(getJSON('https://api.github.com/users'),60);




function getArrayPromiseObservable(arrayPromise)
{
  return Rx.Observable.create(function (observer) {
    arrayPromise.then(json=>{json.forEach((u,i)=>{observer.next(u)}); observer.complete() } );
  });
}  

function getDelayedArrayPromiseObservable(arrayPromise,ratePerMinute)
{
  return getArrayPromiseObservable(arrayPromise)
                      .concatMap(u=>Rx.Observable.interval(erlangInterval(ratePerMinute)).take(1), u => u);
}
//let observable = getDelayedArrayPromiseObservable(getJSON('https://api.github.com/users'),60);



/** *****************************************************************************************************

           AWESOME IMPLEMENTATION

** *****************************************************************************************************/

function erlangInterval(ratePerMinute)
{
  return (-1/ratePerMinute*Math.log(Math.random()))*60000;
}


Rx.Observable.fromArrayPromise = function(arrayPromise) {
  return Rx.Observable.create(function (observer) {
      arrayPromise.then(json=>{json.forEach((u,i)=>{observer.next(u)}); observer.complete() } );
    });
}

Rx.Observable.naturalInterval = function(ratePerMinute, totalDuration)
{
  let naturalObservable = Rx.Observable.create(function (observer) {
    function nextItem(cnt)
    {
      // Maybe the observer has "externally" been stopped while we waited for this invocation
      if (!observer.isStopped && !observer.closed) {
        observer.next(cnt++)
      }  
      // Maybe the observer has been stopped while performing the next() operation
      if (!observer.isStopped && !observer.closed)
      {
        setTimeout(nextItem.bind(null,cnt),erlangInterval(ratePerMinute));
      }
    }
    setTimeout(nextItem.bind(null,0),erlangInterval(ratePerMinute));
  });
  if (totalDuration) naturalObservable = naturalObservable.takeUntil(Rx.Observable.interval(totalDuration));
  return naturalObservable;
}


Rx.Observable.prototype.naturalDelay = function (ratePerMinute) {
  return this.concatMap(u=>Rx.Observable.interval(erlangInterval(ratePerMinute)).take(1), u => u);
}

Rx.Observable.prototype.logProp = function (property) {
  return this.do((x)=>console.log('=>logProp: %s', property ? x[property] : x) );
}

/* ****************************************************************************************************** */

//let observable = Rx.Observable.fromArrayPromise(getJSON('https://api.github.com/users')).naturalDelay(60).logProp('login');

//let observable = Rx.Observable.naturalInterval(120,25000).bufferTime(250).filter(l=>l.length>1);

let observable = Rx.Observable.of('aap','noot','mies','pim','vis','vuur').naturalDelay(60);

observable.subscribe( 
  (x) => console.log('next: %s', x.login ? x.login : x) ,
  (e) => console.log('error: %s', e) ,
  () => console.log('completed') 
);

observable.subscribe( 
  (x) => console.log('next: %s', x.login ? x.login : x) ,
  (e) => console.log('error: %s', e) ,
  () => console.log('completed') 
);


function logIt(v)
{
  var r = v
  return function(){ console.log('=> ',r) }
}


function logIt2(v)
{
  console.log('#=> ',v)
}

// for (val in list) {console.log(val);setTimeout(logIt(val),val*1000)}

// for (val in list) {console.log(val);setTimeout(logIt2.bind(null,val),val*1000)}


// list.forEach((u,i)=>{setTimeout(()=>console.log('=>',u),i*1000) })