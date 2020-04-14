import { Observable } from 'rxjs/Observable';
import { startWith, take, concatMap } from 'rxjs/operators';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/of';
import { MonoTypeOperatorFunction } from 'rxjs/interfaces';

function erlangInterval(ratePerMinute)
{
  return (-1/ratePerMinute*Math.log(Math.random()))*60000;
}

export function naturalDelay<T>(ratePerMinute: number): MonoTypeOperatorFunction<T> {
  return (source) => source.pipe(
      concatMap(u=> Observable.interval(erlangInterval(ratePerMinute)).pipe(take(1)), u => u)
    );
}

export function constantDelay<T>(ratePerMinute: number): MonoTypeOperatorFunction<T> {
    return (source) => source.pipe(
        concatMap(u=> Observable.interval(60000/ratePerMinute).pipe(take(1)), u => u)
      );
}

Observable.of(...[10,20,30,40,50,60,70,80,90,100]).pipe(naturalDelay(30)).subscribe(console.log);