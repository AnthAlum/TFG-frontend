import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MeetingPage } from './meeting-page';

const regexSet : {[key: string]: RegExp} = {
  matter: /^[A-zÀ-ú]+(\s[A-zÀ-ú]*)*$/
};

@Injectable({
  providedIn: 'root'
})
export class BackendMeetingsService {
  private backendUrl: string = "http://localhost:8095/MyOrganization62/TFGAplicactionAPI/1.0.0";
  private meetingsUrl: string = "meetings";
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

  getMeetings(pageNumber: number, pageSize: number): Observable<MeetingPage>{
    const url = `${this.backendUrl}/${this.meetingsUrl}?page=${pageNumber}&size=${pageSize}`;
    return this.httpClient
      .get<MeetingPage>(url, this.httpOptions);
  }
}
