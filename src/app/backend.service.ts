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
  
  authenticationDone(): boolean{
    let token = localStorage.getItem('token');
    if(token){
      this.postJwt(token);
      return true;
    }
    if(this.JWT.localeCompare("JWT") === 0) //Si nuestro JWT no tiene un nuevo token asignado entonces es porque no estamos autenticados.
      return false;
    return true;
  }

  postJwt(jwt: string): void{
    localStorage.setItem('token', jwt);
    this.JWT = jwt;
    if(this.httpOptions.headers.get('Authorization') === undefined)
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', this.JWT);
    else
      this.httpOptions.headers = this.httpOptions.headers.append('Authorization', this.JWT);
  }

  postCredentials(credentials: JsonCredentials): Observable<any>{
    const url = `${this.backendUrl}/${this.loginUrl}`;
    return this.httpClient
      .post<any>(url, { username: credentials.username, password: credentials.password }, this.httpOptions)
      .pipe(
        catchError((error) => {return throwError(error);})
      );
  }

  logout(): void{
    localStorage.removeItem('token');
  }

  getMerchantById(id: string): Observable<any>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/${id}`;
    return this.httpClient
      .get<any>(url, this.httpOptions)
      .pipe(
        catchError((error) => {return throwError(error);})
      );
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
      email: body[3],
      phone: body[4]} as MerchantBody;
    const url = `${this.backendUrl}/${this.merchantsUrl}`;
    return this.httpClient
      .post<any>(url, newMerchant, this.httpOptions);
  }

  putMerchantName(idMerchant: number, newValue: string): Observable<any>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/${idMerchant}/name`;
    return this.httpClient
      .put<any>(url, {"newName" : newValue}, this.httpOptions);
  }

  putMerchantPhone(idMerchant: number, newValue: string): Observable<any>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/${idMerchant}/phone`;
    return this.httpClient
      .put<any>(url, {"newPhone" : newValue}, this.httpOptions);
  }

  putMerchantEmail(idMerchant: number, newValue: string): Observable<any>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/${idMerchant}/email`;
    return this.httpClient
      .put<any>(url, {"newEmail" : newValue}, this.httpOptions);
  }

  putMerchantRole(idMerchant: number, newValue: string): Observable<any>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/${idMerchant}/role`;
    return this.httpClient
      .put<any>(url, {"newRole" : newValue}, this.httpOptions);
  }

  putMerchantPassword(idMerchant: number, newValue: string): Observable<any>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/${idMerchant}/password`;
    return this.httpClient
      .put<any>(url, {"newPassword" : newValue}, this.httpOptions);
  }
}
