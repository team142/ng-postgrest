import { Injectable } from '@angular/core';


import { RequestOptions, Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../environments/environment';



@Injectable()
export class PostgrestServiceService {

  constructor(private http: Http) { }


  public getStuff(url: string): Promise<string[]> {

    let headers = new Headers({
      'Accepts': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url, options)
      .toPromise()
      .then(res => this.returnRows(res))
      .catch(this.handleError);

  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }


  private returnRows(response: Response): Promise<string[]> {

    var t = response.json();
    var paths = t.paths;

    let results: string[] = [];
    for (var item in paths) {
      if (item != "/") {
        results.push(item)
      }
    }




    return Promise.resolve(results);
  }

  public getRows(url: string): Promise<any> {

    let headers = new Headers({
      'Accepts': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url, options)
      .toPromise()
      .then(res => this.returnObjects(res))
      .catch(this.handleError);

  }

  private returnObjects(response: Response): Promise<any> {
    var t = response.json();
    return Promise.resolve(t);
  }


}
