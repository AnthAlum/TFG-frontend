import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
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
  JWT = "JWT";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  postCredentials(credentials: JsonCredentials): Observable<any>{
    const url = `${this.backendUrl}/${this.loginUrl}`;
    return this.httpClient
      .post<any>(url, { username: credentials.username, password: credentials.password }, this.httpOptions)
      .pipe(
        catchError((error) => {return throwError(error);})
      );
  }

  authenticationDone(): boolean{
    if(this.JWT.localeCompare("JWT") === 0) //Si nuestro JWT no tiene un nuevo token asignado entonces es porque no estamos autenticados.
      return false;
    return true;
  }

  postJwt(jwt: string): void{
    this.JWT = jwt;
    if(this.httpOptions.headers.get('Authorization') === undefined)
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', this.JWT);
    else
      this.httpOptions.headers = this.httpOptions.headers.append('Authorization', this.JWT);
  }

  getMerchants(): Observable<any>{
    const url = `${this.backendUrl}/${this.merchantsUrl}`;
    return this.httpClient
      .get<any>(url, this.httpOptions);
  }

  deleteMerchant(idMerchant: string): Observable<any>{
    const url = `${this.backendUrl}/${this.merchantUrl}/${idMerchant}`;
    return this.httpClient
      .delete<any>(url, this.httpOptions);
  }

  postMerchant(body: any): Observable<any>{
    const newMerchant = {role: parseInt(body[0]),
      password: body[1],
      name: body[2],
      phone: body[3],
      email: body[4]} as MerchantBody;
    const url = `${this.backendUrl}/${this.merchantsUrl}`;
    return this.httpClient
      .post<any>(url, newMerchant, this.httpOptions);
  }

  putMerchant(atribute: string, newValue: string): Observable<any>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/${this.idMerchant}/${atribute}`;
    return this.httpClient
      .put<any>(url, {"newPassword" : newValue}, this.httpOptions);
  }

  setMerchantId(idMerchant: string): void{
    this.idMerchant = idMerchant;
  }

  private handleError(error: any) { 
    if(error instanceof HttpErrorResponse){
      // Error in server side
    } else {
      // Error in client side
    }
    return error;
  }

  private assignJwt():void{
    if(this.httpOptions.headers.get('Authorization') === undefined)
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', this.JWT);
    else
      this.httpOptions.headers = this.httpOptions.headers.append('Authorization', this.JWT);
  }
}
