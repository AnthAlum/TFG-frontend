import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from './client';
import { ClientPage } from './client-page';

const regexSet: { [key: string]: RegExp } = {
  name: /^[A-zÀ-ú]+(\s[A-zÀ-ú]*)*$/ ,
  email: /^[A-z0-9\._\+-]{4,}@[A-z0-9\-]{3,}(\.[a-z0-9\-]{2,})+$/ ,
  phone: /^(\+\d{1,3})?[\s\d]{5,}$/ ,
  company: /^[A-zÀ-ú]+(\s[A-zÀ-ú]*)*$/
};

@Injectable({
  providedIn: 'root'
})
export class BackendClientsService {
  private backendUrl: string = "http://localhost:8095/MyOrganization62/TFGAplicactionAPI/1.0.0";
  private clientsUrl: string = "clients";
  JWT = "JWT";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) {
    this.authenticationDone(); 
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

  getValuesRegex(): { [key: string]: RegExp } {
    return regexSet;
  }

  getMerchants(pageNumber: number, pageSize: number): Observable<ClientPage>{
    const url = `${this.backendUrl}/${this.clientsUrl}?page=${pageNumber}&size=${pageSize}`;
    return this.httpClient
      .get<ClientPage>(url, this.httpOptions);
  }

  deleteMerchant(idClient: number): Observable<ClientPage>{
    const url = `${this.backendUrl}/${this.clientsUrl}/${idClient}`;
    return this.httpClient
      .delete<ClientPage>(url, this.httpOptions);
  }

  postClient(body: { [key: string]: string }): Observable<any>{
    const newClient = {
      name: body.name,
      phone: body.phone,
      email: body.email,
      company: body.company
    } as Client;
    const url = `${this.backendUrl}/${this.clientsUrl}`;
    return this.httpClient
      .post<any>(url, newClient, this.httpOptions);
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
      case "company":
        regex = regexSet.company;
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
}
