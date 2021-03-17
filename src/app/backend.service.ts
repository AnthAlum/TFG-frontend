import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AbstractControl } from '@angular/forms';
import { MerchantOption } from './merchant-option';
import { MerchantSimplifiedListResponse } from './merchant-simplified-list-response';

export interface JsonCredentials{
  username: string,
  password: string
}

export interface NewMerchantBody{
  idRole: number,
  password: string,
  name: string,
  email: string,
  phone: string
}

//TODO: ¿que hacemos con el password?
const regexSet: { [key: string]: RegExp } = {
  name: /^[A-zÀ-ú]+(\s[A-zÀ-ú]*)*$/ ,
  email: /^[A-z0-9\._\+-]{4,}@[A-z0-9\-]{3,}(\.[a-z0-9\-]{2,})+$/ ,
  phone: /^(\+\d{1,3})?[\s\d]{5,}$/ ,
  idRole: /[0-1]/
};

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private backendUrl: string = "http://localhost:8095/MyOrganization62/TFGAplicactionAPI/1.0.0";
  private loginUrl: string = "login";
  private merchantsUrl: string = "merchants";

  private idMerchant: string = "";
  JWT = "JWT";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  getValuesRegex(): { [key: string]: RegExp } {
    return regexSet;
  }

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

  logout(): void{
    localStorage.removeItem('token');
    this.JWT = "JWT";
    this.httpOptions.headers = this.httpOptions.headers.delete('Authorization');
  }

  postJwt(jwt: string): void{
    localStorage.setItem('token', jwt);
    this.JWT = jwt;
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', this.JWT);
  }

  //Este metodo comprueba que los datos recibidos cumplan con las regex permitidas.
  verifyValue(attribute: string, value: string): boolean{
    let regex;
    switch(attribute){
      case "name":
        regex = regexSet.name;
        break;
      case "phone":
        regex = regexSet.phone;
        break;
      case "email":
        regex = regexSet.email;
        break;
      case "idRole":
        regex = regexSet.idRole;
        break;
      default:
        return true;
    }
    if(regex.test(value))
      return true;
    return false;
  }

  verifyAllValues(information : { [key: string]: string }): boolean{
    for(let key in regexSet){
      if(!regexSet[key].test(information[key]))
        return false;
    }
    return true;
  }

  postCredentials(credentials: JsonCredentials): Observable<any>{
    const url = `${this.backendUrl}/${this.loginUrl}`;
    return this.httpClient
      .post<any>(url, { username: credentials.username, password: credentials.password }, this.httpOptions)
      .pipe(
        catchError((error) => {return throwError(error);})
      );
  }

  getMerchants(pageNumber: number, pageSize: number): Observable<any>{
    const url = `${this.backendUrl}/${this.merchantsUrl}?page=${pageNumber}&size=${pageSize}`;
    return this.httpClient
      .get<any>(url, this.httpOptions);
  }

  getMerchantById(id: string): Observable<any>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/${id}`;
    return this.httpClient
      .get<any>(url, this.httpOptions)
      .pipe(
        catchError((error) => {return throwError(error);})
      );
  }

  getMerchantsSimplified(): Observable<MerchantSimplifiedListResponse>{
    const url = `${this.backendUrl}/${this.merchantsUrl}-simplified`;
    return this.httpClient
      .get<MerchantSimplifiedListResponse>(url, this.httpOptions);
  }

  getMerchantsByName(name: string, pageNumber: number, pageSize: number): Observable<any>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/findbyname?name=${name}&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient
      .get<any>(url, this.httpOptions);
  }

  getMerchantsByEmail(email: string, pageNumber: number, pageSize: number): Observable<any>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/findbyemail?email=${email}&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient
      .get<any>(url, this.httpOptions);
  }

  getMerchantsByPhone(phone: string, pageNumber: number, pageSize: number): Observable<any>{
    phone = phone.replace('+', '%2B');
    const url = `${this.backendUrl}/${this.merchantsUrl}/findbyphone?phone=${phone}&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient
      .get<any>(url, this.httpOptions);
  }

  getMerchantsByIdRole(idRole: number, pageNumber: number, pageSize: number): Observable<any>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/findbyidRole?idRole=${idRole}&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient
      .get<any>(url, this.httpOptions);
  }

  deleteMerchant(idMerchant: string): Observable<any>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/${idMerchant}`;
    return this.httpClient
      .delete<any>(url, this.httpOptions);
  }

  postMerchant(body: { [key: string]: string }): Observable<any>{
    const newMerchant = {
      name: body.name,
      phone: body.phone,
      email: body.email,
      password: body.password,
      idRole: parseInt(body.idRole)
    } as NewMerchantBody;
    const url = `${this.backendUrl}/${this.merchantsUrl}`;
    return this.httpClient
      .post<any>(url, newMerchant, this.httpOptions);
  }

  putMerchantNewValue(idMerchant: number, attribute: string, newValue: string): any{
    let response;
    switch(attribute){
      case "name":
        response = this.putMerchantName(idMerchant, newValue);
        break;
      case "email":
        response = this.putMerchantEmail(idMerchant, newValue);
        break;
      case "phone":
        response = this.putMerchantPhone(idMerchant, newValue);
        break;
      case "idRole":
        response = this.putMerchantIdRole(idMerchant, newValue);
        break;
    }
    return response;
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

  putMerchantIdRole(idMerchant: number, newValue: string): Observable<any>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/${idMerchant}/role`;
    let idRole: number = parseInt(newValue);
    return this.httpClient
      .put<any>(url, {"newRole" : newValue}, this.httpOptions);
  }

  putMerchantPassword(idMerchant: number, oldPassword: string, newPassword: string): Observable<any>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/${idMerchant}/password`;
    return this.httpClient
      .put<any>(url, {"password": oldPassword , "newPassword" : newPassword }, this.httpOptions);
  }
}
