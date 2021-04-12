import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MeetingPage } from './meeting-page';
import { Meeting } from './meeting';
import { WordCloudResponse } from './word-cloud-response';
import { MeetingFile } from './meeting-file';
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
  }

  getValuesRegex(): { [key: string]: RegExp } {
    return regexSet;
  }

  getMeetings(pageNumber: number, pageSize: number): Observable<MeetingPage>{
    const url = `${this.backendUrl}/${this.meetingsUrl}?page=${pageNumber}&size=${pageSize}`;
    return this.httpClient
      .get<MeetingPage>(url, this.httpOptions);
  }

  getMeetingById(idMeeting: number): Observable<Meeting>{
    const url = `${this.backendUrl}/${this.meetingsUrl}/${idMeeting}`;
    return this.httpClient
      .get<Meeting>(url, this.httpOptions);
  }

  getWordCloudById(idMeeting: number): Observable<WordCloudResponse>{
    const url = `${this.backendUrl}/${this.meetingsUrl}/${idMeeting}/wordcloud`;
    return this.httpClient
      .get<WordCloudResponse>(url, this.httpOptions);
  }

  getMeetingFileById(idMeeting: number, idFile: number): any {
    const url = `${this.backendUrl}/${this.meetingsUrl}/${idMeeting}/files/${idFile}`;
    return this.httpClient
      .get(url, {
        headers: new HttpHeaders({
          'Authorization': localStorage.getItem('token')!,
        }),
        responseType: 'blob',
      });
  }

  getMeetingsByMatter(matter: string, pageNumber: number, pageSize: number): Observable<MeetingPage>{
    const url = `${this.backendUrl}/${this.meetingsUrl}/findbymatter?matter=${matter}&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient
      .get<MeetingPage>(url, this.httpOptions);
  }

  postFile(idMeeting: number, file: File): Observable<MeetingFile>{
    var fd = new FormData();
    fd.append('file', file);

    const url = `${this.backendUrl}/${this.meetingsUrl}/${idMeeting}/files`;
    return this.httpClient
      .post<MeetingFile>(url, fd,{
        headers: new HttpHeaders({ 'Authorization': localStorage.getItem('token')! })
      });
  }

  postMeetingDescriptionFromFile(idMeeting: number, idFile: number): Observable<Meeting>{
    const url = `${this.backendUrl}/${this.meetingsUrl}/${idMeeting}/files/${idFile}`;
    return this.httpClient.post<Meeting>(url, undefined , this.httpOptions);
  }

  postMeetingNewKeyword(idMeeting: number, keyword: string): Observable<{}>{
    const url = `${this.backendUrl}/${this.meetingsUrl}/${idMeeting}/keywords`;
    return this.httpClient.post<{}>(url, {'keyword': keyword}, this.httpOptions);
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

  deleteMeetingFile(idMeeting: number, idFile: number): Observable<{}>{
    const url = `${this.backendUrl}/${this.meetingsUrl}/${idMeeting}/files/${idFile}`;
    return this.httpClient.delete<{}>(url, this.httpOptions);
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
    return day + '-' + month + '-' + dateISO.getFullYear() + ' 00:00'; // Get the fiven date with 00:00 time
  }
}
