import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';



export interface JsonCredentials{
  username: string,
  password: string
}


@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private backendUrl: string = "http://localhost:8095/MyOrganization62/TFGAplicactionAPI/1.0.0";
  private loginUrl: string = "login";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  postCredentials(credentials: JsonCredentials): Observable<any>{
    const url = `${this.backendUrl}/${this.loginUrl}`;
    return this.httpClient.
      post<any>(url, { username: 'correo@example.com', password: 'null' }, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('postCredentials'))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
