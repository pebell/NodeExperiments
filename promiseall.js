function promiseAll(promArr) {
  return promArr.reduce((prev, curr) =>
    prev.then(prevValArr =>
      curr.then(currVal => prevValArr.concat(currVal))
    ),
    Promise.resolve([])
  );
}
function promiseRace(promArr) {
  return new Promise((resolve,reject)=> {
    promArr.forEach((prom) => {prom.then((result)=>resolve(result))});
    })
  };


var proms = [10000, 2000, 5000].map(ms => new Promise((resolve,reject)=> {
  setTimeout( ()=> {
    console.log(`done in ${ms} ms`);
    resolve(`worked for ${ms} ms`);}
  , ms
  );
})); 
//var totalProm = promiseAll(proms).then(v=>(console.log('totally done',v),v));
var totalProm = promiseRace(proms).then(v=>(console.log('totally done',v),v));
