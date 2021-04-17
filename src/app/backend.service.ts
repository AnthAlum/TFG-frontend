import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MerchantSimplifiedListResponse } from './merchant-simplified-list-response';
import { JwtResponse } from './jwt-response';
import { Merchant } from './merchant';
import { MerchantPage } from './merchant-page';

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

  postCredentials(credentials: JsonCredentials): Observable<JwtResponse>{
    const url = `${this.backendUrl}/${this.loginUrl}`;
    return this.httpClient
      .post<JwtResponse>(url, { username: credentials.username, password: credentials.password }, this.httpOptions)
      .pipe(
        catchError((error) => {return throwError(error);})
      );
  }

  getMerchants(pageNumber: number, pageSize: number): Observable<MerchantPage>{
    const url = `${this.backendUrl}/${this.merchantsUrl}?page=${pageNumber}&size=${pageSize}`;
    return this.httpClient
      .get<MerchantPage>(url, this.httpOptions);
  }

  getMerchantById(id: string): Observable<Merchant>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/${id}`;
    return this.httpClient
      .get<Merchant>(url, this.httpOptions)
      .pipe(
        catchError((error) => {return throwError(error);})
      );
  }

  getMerchantByEmail(email: string): Observable<Merchant>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/email?email=${email}`;
    return this.httpClient
      .get<Merchant>(url, this.httpOptions);
  }

  getMerchantsSimplified(): Observable<MerchantSimplifiedListResponse>{
    const url = `${this.backendUrl}/${this.merchantsUrl}-simplified`;
    return this.httpClient
      .get<MerchantSimplifiedListResponse>(url, this.httpOptions);
  }

  getMerchantsByName(name: string, pageNumber: number, pageSize: number): Observable<MerchantPage>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/findbyname?name=${name}&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient
      .get<MerchantPage>(url, this.httpOptions);
  }

  getMerchantsByEmail(email: string, pageNumber: number, pageSize: number): Observable<MerchantPage>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/findbyemail?email=${email}&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient
      .get<MerchantPage>(url, this.httpOptions);
  }

  getMerchantsByPhone(phone: string, pageNumber: number, pageSize: number): Observable<MerchantPage>{
    phone = phone.replace('+', '%2B');
    const url = `${this.backendUrl}/${this.merchantsUrl}/findbyphone?phone=${phone}&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient
      .get<MerchantPage>(url, this.httpOptions);
  }

  getMerchantsByIdRole(idRole: number, pageNumber: number, pageSize: number): Observable<MerchantPage>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/findbyidRole?idRole=${idRole}&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient
      .get<MerchantPage>(url, this.httpOptions);
  }

  deleteMerchant(idMerchant: string): Observable<{}>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/${idMerchant}`;
    return this.httpClient
      .delete<{}>(url, this.httpOptions);
  }

  postMerchant(body: { [key: string]: string }): Observable<{}>{
    const newMerchant = {
      name: body.name,
      phone: body.phone,
      email: body.email,
      password: body.password,
      idRole: parseInt(body.idRole)
    } as NewMerchantBody;
    const url = `${this.backendUrl}/${this.merchantsUrl}`;
    return this.httpClient
      .post<{}>(url, newMerchant, this.httpOptions);
  }

  putMerchantNewValue(idMerchant: number, attribute: string, newValue: string): Observable<{}>{
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

  putMerchantName(idMerchant: number, newValue: string): Observable<{}>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/${idMerchant}/name`;
    return this.httpClient
      .put<{}>(url, {"newName" : newValue}, this.httpOptions);
  }

  putMerchantPhone(idMerchant: number, newValue: string): Observable<{}>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/${idMerchant}/phone`;
    return this.httpClient
      .put<{}>(url, {"newPhone" : newValue}, this.httpOptions);
  }

  putMerchantEmail(idMerchant: number, newValue: string): Observable<{}>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/${idMerchant}/email`;
    return this.httpClient
      .put<{}>(url, {"newEmail" : newValue}, this.httpOptions);
  }

  putMerchantIdRole(idMerchant: number, newValue: string): Observable<{}>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/${idMerchant}/role`;
    return this.httpClient
      .put<{}>(url, {"newRole" : newValue}, this.httpOptions);
  }

  putMerchantPassword(idMerchant: number, oldPassword: string, newPassword: string): Observable<{}>{
    const url = `${this.backendUrl}/${this.merchantsUrl}/${idMerchant}/password`;
    return this.httpClient
      .put<{}>(url, {"password": oldPassword , "newPassword" : newPassword }, this.httpOptions);
  }
}
