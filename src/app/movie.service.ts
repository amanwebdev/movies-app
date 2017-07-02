import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

import { Movie } from './movie';
import { AngularIndexedDB } from 'angular2-indexeddb';

@Injectable()
export class MovieService {

  private options: RequestOptions;

  private baseUrl = 'http://starlord.hackerearth.com';
  private db = new AngularIndexedDB('myDb', 1);

  constructor(private http: Http) {
    this.getHeaders();
  }

  private getHeaders(): void {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: headers });
  }

  public getMovieListing(): Observable<Movie[]> {
    const url = `${this.baseUrl}/movieslisting`;
    return this.http.get(url, this.options)
      .map(resp => {
        return resp.json();
      })
      .catch(this.handleError);
  }


  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
