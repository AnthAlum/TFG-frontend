import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from './client';
import { ClientPage } from './client-page';

const regexSet: { [key: string]: RegExp } = {
  name: /^[A-zÀ-ú]+(\s[A-zÀ-ú]*)*$/ ,
  email: /^[A-z0-9\._\+-]{4,}@[A-z0-9\-]{3,}(\.[a-z0-9\-]{2,})+$/ ,
  phone: /^(\+\d{1,3})?[\s\d]{5,}$/ ,
  company: /^[A-zÀ-ú'0-9]+(\s[A-zÀ-ú0-9]*)*$/
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
  }


  getValuesRegex(): { [key: string]: RegExp } {
    return regexSet;
  }

  getClients(pageNumber: number, pageSize: number): Observable<ClientPage>{
    const url = `${this.backendUrl}/${this.clientsUrl}?page=${pageNumber}&size=${pageSize}`;
    return this.httpClient
      .get<ClientPage>(url, this.httpOptions);
  }

  getClientById(id: string): Observable<Client>{
    const url = `${this.backendUrl}/${this.clientsUrl}/${id}`;
    return this.httpClient
      .get<Client>(url, this.httpOptions);
  }

  getClientsByName(name: string, pageNumber: number, pageSize: number): Observable<ClientPage>{
    const url = `${this.backendUrl}/${this.clientsUrl}/findbyname?name=${name}&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient
      .get<ClientPage>(url, this.httpOptions);
  }

  getClientsByPhone(phone: string, pageNumber: number, pageSize: number): Observable<ClientPage>{
    const url = `${this.backendUrl}/${this.clientsUrl}/findbyemail?email=${phone}&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient
      .get<ClientPage>(url, this.httpOptions);
  }

  getClientsByAttribute(attribute: string, value: string, pageNumber: number, pageSize: number): Observable<ClientPage>{
    value = value.replace('+', '%2B'); //Spring recibe ' ' en lugar de '+' si no hacemos este cambio.
    const url = `${this.backendUrl}/${this.clientsUrl}/findby${attribute}?${attribute}=${value}&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient
      .get<ClientPage>(url, this.httpOptions);
  }

  getClientsByCompany(company: string, pageNumber: number, pageSize: number): Observable<ClientPage>{
    const url = `${this.backendUrl}/${this.clientsUrl}/findbyemail?email=${company}&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient
      .get<ClientPage>(url, this.httpOptions);
  }

  deleteClient(idClient: number): Observable<{}>{
    const url = `${this.backendUrl}/${this.clientsUrl}/${idClient}`;
    return this.httpClient
      .delete<{}>(url, this.httpOptions);
  }

  postClient(body: { [key: string]: string }): Observable<{}>{
    const newClient = {
      name: body.name,
      phone: body.phone,
      email: body.email,
      company: body.company
    } as Client;
    const url = `${this.backendUrl}/${this.clientsUrl}`;
    return this.httpClient
      .post<{}>(url, newClient, this.httpOptions);
  }

  putClientNewValue(idClient: number, attribute: string, newValue: string): Observable<{}>{
    const url = `${this.backendUrl}/${this.clientsUrl}/${idClient}/${attribute}`;
    let attributeName = 'new' + attribute;
    attributeName = attributeName.substr(0, 3) + attributeName[3].toUpperCase() + attributeName.substr(4);
    let body :{[key: string]: string} = {};
    body[`${attributeName}`] = `${newValue}`;
    return this.httpClient
      .put<{}>(url, body, this.httpOptions);
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
