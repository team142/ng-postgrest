import { Injectable } from "@angular/core";

import { RequestOptions, Headers, Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/toPromise";
import { environment } from "../../environments/environment";

@Injectable()
export class PostgrestServiceService {
  constructor(private http: Http) {}

  public fetchRows(db: {url: string, auth: string}, url: string): Promise<{ name: string; pkey: string }[]> {
    let headers = new Headers({
      Accepts: "application/json",
      Authorization: "Bearer " + db.auth
    });
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(url, options)
      .toPromise()
      .then(res => this.returnRows(res))
      .catch(this.handleError);
  }

  public doPatch(db: {url: string, auth: string}, url: string, jsonPayload: string): Promise<string[]> {
    let headers = new Headers({
      "Content-type": "application/json",
      Authorization: "Bearer " + db.auth
    });
    let options = new RequestOptions({ headers: headers });
    return this.http
      .patch(url, jsonPayload, options)
      .toPromise()
      .catch(this.handleError);
  }

  public doDelete(db: {url: string, auth: string},url: string): Promise<string[]> {
    let headers = new Headers({
      "Content-type": "application/json",
      Authorization: "Bearer " + db.auth
    });
    let options = new RequestOptions({ headers: headers });
    return this.http
      .delete(url, options)
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  private returnRows(
    response: Response
  ): Promise<{ name: string; pkey: string }[]> {
    var t = response.json();
    var paths = t.paths;
    var definitions = t.definitions;

    let results: { name: string; pkey: string }[] = [];
    for (var item in paths) {
      if (item != "/" && item.indexOf('/rpc/')!= 0) {
        var name = item;
        var pkey: string;
        var sName = name.replace('/', '')
        for (var prop in definitions[sName]["properties"]) {
          if (definitions[sName]["properties"][prop]["description"] && definitions[sName]["properties"][prop]["description"].indexOf("Primary Key")) {
            pkey = prop;
          }
          results.push({ name: name, pkey: pkey });
        }
      }
    }

    return Promise.resolve(results);
  }

  public getRows(db: {url: string, auth: string}, url: string): Promise<any> {
    let headers = new Headers({
      Accepts: "application/json",
      Authorization: "Bearer " + db.auth
    });
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(url, options)
      .toPromise()
      .then(res => this.returnObjects(res))
      .catch(this.handleError);
  }

  private returnObjects(response: Response): Promise<any> {
    var t = response.json();
    return Promise.resolve(t);
  }
}
