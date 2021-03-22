import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, SelectControlValueAccessor } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadingService } from '../loading.service';
import { Meeting } from '../meeting';
import {COMMA, ENTER, I} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {map, startWith} from 'rxjs/operators';
import {MatChipEvent, MatChipInputEvent, MatChipListChange} from '@angular/material/chips';
import { BackendClientsService } from '../backend-clients.service';
import { BackendService } from '../backend.service';
import { BackendMeetingsService } from '../backend-meetings.service';
import { Merchant } from '../merchant';

const NOT_FOUND: number = -1;
const ID_INDEX: number = 0;
const EMAIL_INDEX: number = 1;
const ID_MERCHANT: string = 'idMerchant';
const ID_CLIENT: string = 'idClient';
@Component({
  selector: 'app-meeting-detail',
  templateUrl: './meeting-detail.component.html',
  styleUrls: ['./meeting-detail.component.css']
})
export class MeetingDetailComponent implements OnInit {

  fontSize: string = "25px";
  format: number = 24;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @ViewChild('picker') pickerDate: any;
  @ViewChild('picker') pickerTime: any;
  formControl: {[key: string]: FormControl} = {
    matter: new FormControl(''),
    date: new FormControl(''),
    time: new FormControl(''),
    merchantsCtrl: new FormControl(),
    clientsCtrl: new FormControl(),
    description: new FormControl(),
    keywordsCtrl: new FormControl(),
  }

  formGroup = this.formBuilder.group({
    matter: '',
    date: '',
    time: '',
    merchantsCtrl: '',
    clientsCtrl: '',
    description: '',
    keywordsCtrl: '',
  });
  //Merchant chips variables
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredMerchants: Observable<any[]>;
  actualMerchants: string[] = []; //Actual merchants
  availableMerchants: string[] = []; //Available merchants
  @ViewChild('merchantInput') merchantInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoMerchant') matAutocompleteMerchants: MatAutocomplete;

  //Client chips variables
  filteredClients: Observable<any[]>;
  actualClients: string[] = []; //Actual clients
  availableClients: string[] = []; //Available clients
  @ViewChild('clientInput') clientInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoClient') matAutocompleteClients: MatAutocomplete;

  //Keyword chips variables
  filteredKeywords: Observable<any[]>;
  actualKeywords: string[] = []; //Actual clients
  availableKeywords: string[] = []; //Available clients
  @ViewChild('keywordInput') keywordInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoKeyword') matAutocompleteKeywords: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<MeetingDetailComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Meeting,
    private loadingService: LoadingService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private formBuilder: FormBuilder,
    private merchantsService: BackendService,
    private clientsService: BackendClientsService,
    private meetingService: BackendMeetingsService,
  ) {

  }

  ngOnInit(): void {
    this.setFormValueChanges();
    this.loadAvailableInformation();
  }

  setFormValueChanges(): void{
    this.formGroup.get('merchantsCtrl')!.valueChanges.subscribe(
      merchant => this.merchantsService.getMerchantsByName(merchant ? merchant : '', 0, 25).subscribe(
        filteredMerchants => {
          this.filteredMerchants = filteredMerchants.pages;
          this.removeSelected(this.filteredMerchants, this.actualMerchants);
        }));
    this.formGroup.get('clientsCtrl')!.valueChanges.subscribe(
      client => this.clientsService.getClientsByName(client ? client : '', 0, 25).subscribe(
        filteredClients => {
          this.filteredClients = filteredClients.pages;
          this.removeSelected(this.filteredClients, this.actualClients);
        }));
    /*this.formGroup.get('keywordsCtrl')!.valueChanges.subscribe(
      keyword => this.meetingService.getKeywordsByTerm(keyword ? keyword : '', 0, 25).subscribe(
        filteredKeywords => {
          this.filteredKeywords = filteredKeywords.pages;
          this.removeSelected(this.filteredKeywords, this.actualKeywords);
        }));*/
  }

  loadAvailableInformation(): void{
    this.loadingService.show();
    this.merchantsService.getMerchants(0, 100).subscribe(merchants => { //Get all merchants
      this.filteredMerchants = merchants.pages;
      merchants.pages.forEach(merchant => this.availableMerchants.push(merchant.idMerchant + '/' + merchant.email));//Add merchants to the chip list
      this.data.merchants.Merchants.forEach(selectedMerchant => this.actualMerchants.push(selectedMerchant.name + '/' + selectedMerchant.email));
      this.setValues(); //Set meeting values in the form.
      this.removeSelected(this.filteredMerchants, this.actualMerchants);
      this.loadingService.hide();
    });
    this.clientsService.getClients(0, 100).subscribe(clients => {
      this.filteredClients = clients.pages;
      clients.pages.forEach(client => this.availableClients.push(client.idClient + '/' + client.email));//Add clients to the chip list
      this.data.clients.Clients.forEach(selectedClient => this.actualClients.push(selectedClient.name + '/' + selectedClient.email));
      this.setValues(); //Set meeting values in the form.
      this.removeSelected(this.filteredClients, this.actualClients);
      this.loadingService.hide();
    });
    this.actualKeywords = this.data.keywords;
  }



  //Extract the selected merchants/clients from available merchants/clients.
  removeSelected(filteredSubjects: Observable<any[]>, actualSubjects: string[]){
    //Search indexes to the elements to remove
    let indexes: number[] = []; // Indexes to remove
    actualSubjects.forEach(actual => { //
      for(var i = 0; i < filteredSubjects.length; i++){
        if(filteredSubjects[i].email.localeCompare(actual.split('/')[EMAIL_INDEX]) === 0){ //Compare emails
          indexes.push(i); //Storing the indexes for remove.
          break;
        }
      }
    });
    //Remove elements.
    indexes = indexes.sort((a, b) => a - b);
    for (var index = indexes.length -1; index >= 0; index--)
      filteredSubjects.splice(indexes[index], 1);
  }

  add(event: MatChipInputEvent, array: string[], formControl: FormControl): void { //Watch out about the array type
    const input = event.input;
    const value = (event.value || '').trim();
    // Add our element
    if (value) {
      array.push(value); // Watch out!
    }
    // Clear the input value
    // Reset the input value
    if (input) {
      input.value = '';
    }
    formControl.setValue(null);
  }

  removeMerchant(event: MatChipEvent, element: string): void { //Search element and remove from array.
    const index = this.actualMerchants.indexOf(element);
    if (index >= 0) {
      let nameAndEmail = event.chip.value.replace(' cancel', '');
      let idSubject = this.searchSubject(nameAndEmail, this.availableMerchants, ID_MERCHANT);
      this.loadingService.show();
      this.meetingService.deleteMeetingMerchant(this.data.idMeeting, idSubject).subscribe(
        _ => {
          this.actualMerchants.splice(index, 1) //Removes element in the given array
          this.filteredMerchants.push({idMerchant: idSubject, name: nameAndEmail.split('/')[0], email: nameAndEmail.split('/')[EMAIL_INDEX]});
          this.loadingService.hide();
        }
      );
    }
  }

  removeClient(event: MatChipEvent, element: string): void { //Search element and remove from array.
    const index = this.actualClients.indexOf(element);
    if (index >= 0) {
      let nameAndEmail = event.chip.value.replace(' cancel', '');
      let idSubject = this.searchSubject(nameAndEmail, this.availableClients, ID_CLIENT);
      this.loadingService.show();
      this.meetingService.deleteMeetingClient(this.data.idMeeting, idSubject).subscribe(
        _ => {
          this.actualClients.splice(index, 1) //Removes element in the given array
          this.filteredClients.push({idClient: idSubject, name: nameAndEmail.split('/')[0], email: nameAndEmail.split('/')[EMAIL_INDEX]});
          this.loadingService.hide();
        }
      );
    }
  }

  removeKeyword(event: MatChipEvent, keyword: string): void {
    const index = this.actualClients.indexOf(keyword);
    this.loadingService.show();
    this.meetingService.deleteMeetingKeyword(this.data.idMeeting, keyword).subscribe(
      _ => {
        this.actualKeywords.splice(index, 1) //Removes element in the given array
        this.loadingService.hide();
      }
    );

  }

  selectedMerchant(event: MatAutocompleteSelectedEvent, inputName: string, formControl: FormControl): void {
    let input = document.getElementById(inputName); // Get the respective input.
    let subjectId = this.searchSubject(event.option.viewValue, this.filteredMerchants, ID_MERCHANT); // Get the respective Id of merchant
    this.meetingService.postMeetingNewMerchant(this.data.idMeeting, subjectId).subscribe(
      _ => {
        this.actualMerchants.push(event.option.viewValue); //Add element in the given array
        input!.value = ''; //Reset its value.
        formControl.setValue(null); //Reset form value.
        this.loadingService.hide();
      }
    );
    this.loadingService.show();
  }

  selectedClient(event: MatAutocompleteSelectedEvent, inputName: string, formControl: FormControl): void {
    let input = document.getElementById(inputName); // Get the respective input.
    let subjectId = this.searchSubject(event.option.viewValue, this.filteredClients, ID_CLIENT); // Get the respective Id of merchant
    this.meetingService.postMeetingNewClient(this.data.idMeeting, subjectId).subscribe(
      _ => {
        this.actualClients.push(event.option.viewValue); //Add element in the given array
        input!.value = ''; //Reset its value.
        formControl.setValue(null); //Reset form value.
        this.loadingService.hide();
      }
    );
    this.loadingService.show();
  }

  selectedKeyword(event: MatChipListChange): void{
    this.loadingService.show();
    this.meetingService.postMeetingNewKeyword(this.data.idMeeting, event.value).subscribe(
      _ => {
        this.actualKeywords.push(event.value);
        this.formControl.keywordsCtrl.setValue(null);
        this.loadingService.hide();
      }
    );
  }

  searchSubject(nameAndEmail: string, subjects: Observable<any[]> | string[], fieldId: string): number {
    let email = nameAndEmail.split('/')[EMAIL_INDEX]; //Get email from selected option
    let outputId = NOT_FOUND;
    subjects.forEach(subject => {
      if(subject.email !== undefined){
        if(subject.email.localeCompare(email) === 0){
          outputId = subject[fieldId];
          return;
        }
      }
      else
        if(email.localeCompare(subject.split('/')[EMAIL_INDEX]) === 0){
          outputId = parseInt(subject.split('/')[ID_INDEX]);
          return;
        }
    });
    return outputId;
  }

  close(): void{
    this.dialogRef.close();
  }

  setValues(): void{
    this.formGroup.setValue({
      'matter': this.data.matter,
      'date': this.data.date,
      'description': this.data.description,
      'time': '',
      'merchantsCtrl': '',
      'clientsCtrl': '',
      'keywordsCtrl': '',
    });
  }

  //Change date format: ISO to 'dd/mm/yyyy hh:mm'
  modifyMeetingDate(): void{
    let dateISO = this.formGroup.get('date').value;
    let day = dateISO.getDate() > 9 ? dateISO.getDate() : '0' + dateISO.getDate();
    let month = (dateISO.getMonth()+1) > 9 ? (dateISO.getMonth()+1) : '0' + (dateISO.getMonth()+1);
    let newDate = day + '-' + month + '-' + dateISO.getFullYear() + ' 00:00'; // Get the fiven date with 00:00 time
    this.loadingService.show();
    this.meetingService.putMeetingNewValue(this.data.idMeeting, 'date', newDate).subscribe(_ => this.loadingService.hide(), _ => this.loadingService.hide());
  }
}
