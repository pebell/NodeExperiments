let fetch = require('node-fetch');
let HPA = require('https-proxy-agent');
let agent = new HPA('http://proxy.ontwikkel.local:8080');
let Rx = require('rx');


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


function processUsers(json)
{
  for (val in json) {console.log(json[val].login)};
}

//let users = getUsers(processUsers)


var requestStream = Rx.Observable.just('https://api.github.com/users');
var responseStream;

requestStream.subscribe(function(requestUrl) {
  responseStream = Rx.Observable.create(function (observer) {
    getJSON(requestUrl).then(json=>{json.forEach(u=>observer.onNext(u))}).catch(e=>{observer.onError(e)}).then(()=>{observer.onCompleted()});
  
  });

  responseStream.subscribe(function(response) {
    // do something with the response
    console.log('###########',response.login);
  });

    responseStream.subscribe(function(response) {
    // do something with the response
    console.log('>>>>>>>>>>>>>',response.login);
  });
});

//responseStream.onNext({ login: "BOO"});
Rx.Subject.create(()=>console.log('called back with '));


var responseStream = requestStream
  .flatMap(function(requestUrl) {
    return Rx.Observable.fromPromise(getJSON(requestUrl));
  });

var broadcast = new Rx.ReplaySubject();
var longbroadcast = broadcast.filter(t=>t.length>6).delay(10000);
longbroadcast.subscribe(console.log)
longbroadcast.subscribe(t=>console.log('% ',t))

broadcast.onNext('hallo');
broadcast.onNext('how are you');
broadcast.onNext('goodbye');

  // responseStream.subscribe(function(response) {
  //   // do something with the response
  //   //console.log('###########\n',response,'\n------------------\n');
  //   response.forEach(v=>console.log(v))

  // });



//fetch('http://216.58.192.3').then(r => console.log('yay')).catch((err) => console.log('boo',err));
// getJSON('https://api.github.com/users').then((resp)=>console.log('hoi: ',resp)).catch(console.log);
 //getJSON('https://192.30.253.116/users').then((resp)=>console.log('hoi: ',resp)).catch(console.log);
//get('http://google.com').then((resp)=>console.log(resp)).catch(console.log)
//192.30.253.116
// var options = {
// hostname: "proxy.ontwikkel.local",
// port: 8080,
// path: "http://www.xyz.com",
// headers: {
//   Host: "www.xyz.com"
//          }
// };