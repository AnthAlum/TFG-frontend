import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MeetingPage } from './meeting-page';
import { Meeting } from './meeting';
import { NewMerchantBody } from './backend.service';
import { NewMeetingBody } from './new-meeting-body';

const regexSet : {[key: string]: RegExp} = {
  matter: /^[A-zÀ-ú0-9]+(\s[A-zÀ-ú0-9]*)*$/,
  date: /[0-9]{4}(\/[0-9]){2}\s[0-9]{2}\:[0-9]{2}/
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

  getMeetingById(id: number): Observable<Meeting>{
    const url = `${this.backendUrl}/${this.meetingsUrl}/${id}`;
    return this.httpClient
      .get<Meeting>(url, this.httpOptions);
  }

  getMeetingsByMatter(matter: string, pageNumber: number, pageSize: number): Observable<MeetingPage>{
    const url = `${this.backendUrl}/${this.meetingsUrl}/findbymatter?matter=${matter}&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient
      .get<MeetingPage>(url, this.httpOptions);
  }

  postMeetingNewKeyword(idMeeting: number, keyword: string): Observable<{}>{
    const url = `${this.backendUrl}/${this.meetingsUrl}/${idMeeting}/keywords`;
    return this.httpClient.
      post<{}>(url, {'keyword': keyword}, this.httpOptions);
  }

  postMeetingNewMerchant(idMeeting: number, idMerchant: number): Observable<{}>{
    const url = `${this.backendUrl}/${this.meetingsUrl}/${idMeeting}/merchants`;
    return this.httpClient.
      post<{}>(url, {'subjectId': idMerchant}, this.httpOptions);
  }

  postMeetingNewClient(idMeeting: number, idClient: number): Observable<{}>{
    const url = `${this.backendUrl}/${this.meetingsUrl}/${idMeeting}/clients`;
    return this.httpClient.
      post<{}>(url, {'subjectId': idClient}, this.httpOptions);
  }

  postNewMeeting(body: NewMeetingBody): Observable<{}>{
    const url = `${this.backendUrl}/${this.meetingsUrl}`;
    return this.httpClient.
      post<{}>(url, body, this.httpOptions);
  }

  putMeetingNewValue(idMeeting: number, attribute: string, newValue: string ): Observable<{}>{
    const url = `${this.backendUrl}/${this.meetingsUrl}/${idMeeting}/${attribute}`;
    let attributeName = 'new' + attribute;
    attributeName = attributeName.substr(0, 3) + attributeName[3].toUpperCase() + attributeName.substr(4);
    let body :{[key: string]: string} = {};
    body[`${attributeName}`] = `${newValue}`;
    return this.httpClient
      .put<{}>(url, body, this.httpOptions);
  }

  putMeetingNewDate(idMeeting: number, newValue: Date): Observable<{}>{
    const url = `${this.backendUrl}/${this.meetingsUrl}/${idMeeting}/date`;
    //newValue = newValue.replace(' ', 'T');
    let newDate: string = this.modifyMeetingDate(newValue);
    newDate = newDate.concat(':00.000');
    return this.httpClient
      .put<{}>(url, {"newDate": newDate}, this.httpOptions);
  }

  deleteMeetingKeyword(idMeeting: number, keyword: string): Observable<{}>{
    const url = `${this.backendUrl}/${this.meetingsUrl}/${idMeeting}/keywords/${keyword}`;
    return this.httpClient.
      delete<{}>(url, this.httpOptions);
  }

  deleteMeetingMerchant(idMeeting: number, idMerchant: number): Observable<{}>{
    const url = `${this.backendUrl}/${this.meetingsUrl}/${idMeeting}/merchants/${idMerchant}`;
    return this.httpClient.
      delete<{}>(url, this.httpOptions);
  }

  deleteMeetingClient(idMeeting: number, idClient: number): Observable<{}>{
    const url = `${this.backendUrl}/${this.meetingsUrl}/${idMeeting}/clients/${idClient}`;
    return this.httpClient.
      delete<{}>(url, this.httpOptions);
  }

  deleteMeeting(idMeeting: number): Observable<{}>{
    const url : string = `${this.backendUrl}/${this.meetingsUrl}/${idMeeting}`;
    return this.httpClient
      .delete(url, this.httpOptions);
  }

  //Change date format: ISO to 'dd/mm/yyyy hh:mm'
  modifyMeetingDate(dateISO: Date): string{
    let day = dateISO.getDate() > 9 ? dateISO.getDate() : '0' + dateISO.getDate();
    let month = (dateISO.getMonth()+1) > 9 ? (dateISO.getMonth()+1) : '0' + (dateISO.getMonth()+1);
    let newDate = day + '-' + month + '-' + dateISO.getFullYear() + ' 00:00'; // Get the fiven date with 00:00 time
    return newDate;
    //this.loadingService.show();
    //this.meetingService.putMeetingNewValue(this.data.idMeeting, 'date', newDate).subscribe(_ => this.loadingService.hide(), _ => this.loadingService.hide());
  }
}
