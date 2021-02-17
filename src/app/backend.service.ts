import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface JsonCredentials{
  username: string,
  password: string
}

export interface MerchantBody{
  role: number,
  password: string,
  name: string,
  email: string,
  phone: string
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private backendUrl: string = "http://localhost:8095/MyOrganization62/TFGAplicactionAPI/1.0.0";
  private loginUrl: string = "login";
  private merchantUrl: string = "merchants";
  private merchantsUrl: string = "merchants";
  
  private idMerchant: string = "";
  //TODO: Quitar la sig linea
  JWT = "JWT";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  postCredentials(credentials: JsonCredentials): Observable<any>{
    const url = `${this.backendUrl}/${this.loginUrl}`;
    console.log(this.httpOptions);
    
    return this.httpClient //TODO: Quitar los valores definidos
      .post<any>(url, { username: 'correo@example.com', password: 'null' }, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('postCredentials'))
      );
  }

  postJwt(jwt: string): void{
    this.JWT = jwt;
  }

  getMerchants(): Observable<any>{
    //TODO: Quitar la siguiente linea.
    this.assignJwt();
    console.log(this.httpOptions);
    const url = `${this.backendUrl}/${this.merchantsUrl}`;
    return this.httpClient
      .get<any>(url, this.httpOptions);
  }

  deleteMerchant(idMerchant: string): Observable<any>{
    //TODO: Quitar la siguiente linea.
    this.assignJwt();
    console.log(this.httpOptions.headers);
    const url = `${this.backendUrl}/${this.merchantUrl}/${idMerchant}`;
    return this.httpClient
      .delete<any>(url, this.httpOptions);
  }

  postMerchant(body: string[]): Observable<any>{
    const newMerchant = {role: parseInt(body[0]),
      password: body[1],
      name: body[2],
      phone: body[3],
      email: body[4]} as MerchantBody;
    //TODO: Quitar la siguiente linea
    this.assignJwt();
    const url = `${this.backendUrl}/${this.merchantsUrl}`;
    return this.httpClient
      .post<any>(url, newMerchant, this.httpOptions);
  }

  putMerchant(atribute: string, newValue: string): Observable<any>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/${this.idMerchant}/${atribute}`;
    console.log("URL target: " + url + "\n value:" + newValue);
    return this.httpClient
      .put<any>(url, {"newPassword" : newValue}, this.httpOptions);
  }

  setMerchantId(idMerchant: string): void{
    this.idMerchant = idMerchant;
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

  private assignJwt():void{
    console.log(this.httpOptions);
    if(this.httpOptions.headers.get('Authorization') === undefined)
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', this.JWT);
    else
      this.httpOptions.headers = this.httpOptions.headers.append('Authorization', this.JWT);
  }
}
