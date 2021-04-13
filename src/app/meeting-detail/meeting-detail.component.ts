import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import {  FormControl,  Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoadingService } from '../loading.service';
import { Meeting } from '../meeting';
import { ENTER, SPACE} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipEvent, MatChipInputEvent, MatChipList, MatChipListChange} from '@angular/material/chips';
import { BackendClientsService } from '../backend-clients.service';
import { BackendService } from '../backend.service';
import { BackendMeetingsService } from '../backend-meetings.service';
import * as moment from 'moment';
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';
import { saveAs } from 'file-saver';
import { MatTable } from '@angular/material/table';
import { MeetingFile } from '../meeting-file';

const NOT_FOUND: number = -1;
const ID_INDEX: number = 0;
const EMAIL_INDEX: number = 1;

const MYME_TYPES = {
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  json: 'application/json',
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  mpeg: 'video/mpeg',
  pdf: 'application/pdf',

}

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
    matter: new FormControl('', [Validators.required]),
    date: new FormControl(new Date(), [Validators.required]),
    time: new FormControl(''),
    merchantsCtrl: new FormControl(),
    clientsCtrl: new FormControl(),
    description: new FormControl(),
    keywordsCtrl: new FormControl(),
  }
  date: Date;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, SPACE];
  //WordCloud variables
  wordCloudData: CloudData[] = this.buildWordCloudData();
  cloudOptions: CloudOptions = {
    strict: true,
    width: 1,
    height: 200,
  };

  //Merchant chips variables
  moreThanOneMerchants = true;
  filteredMerchants: any;
  actualMerchants: string[] = []; //Actual merchants
  availableMerchants: string[] = []; //Available merchants
  @ViewChild('merchantInput') merchantInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoMerchant') matAutocompleteMerchants: MatAutocomplete;

  //Client chips variables
  moreThanOneClients = true;
  clientError: string;
  filteredClients: any;
  actualClients: string[] = []; //Actual clients
  availableClients: string[] = []; //Available clients
  @ViewChild('clientInput') clientInput: ElementRef<HTMLInputElement>;
  @ViewChild('chipClientList') clientChipList: MatChipList;
  @ViewChild('autoClient') matAutocompleteClients: MatAutocomplete;

  //Keyword chips variables
  filteredKeywords: Observable<any[]>;
  actualKeywords: string[] = []; //Actual clients
  availableKeywords: string[] = []; //Available clients
  @ViewChild('keywordInput') keywordInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoKeyword') matAutocompleteKeywords: MatAutocomplete;
  newKeyword: string = '';

  //Table variables
  @ViewChild(MatTable) fileTable: MatTable<MeetingFile>;
  displayedColumns: string[] = ['name', 'type', 'addDescription', 'delete'];

  constructor(
    public dialogRef: MatDialogRef<MeetingDetailComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Meeting,
    private loadingService: LoadingService,
    private router: Router,
    private merchantsService: BackendService,
    private clientsService: BackendClientsService,
    private meetingService: BackendMeetingsService,
  ) {

  }

  ngOnInit(): void {
    this.setValues(); //Set meeting matter/date/description.
    this.loadAvailableInformation(); //Get available merchants/clients.
    this.formValueChanges(); //Add code in value changes for data filtering.
  }

  /**
   * Set initial values in matter/description/date form field.
   */
  setValues(): void{
    //Assign form values:
    this.formControl['matter'].setValue(this.data.matter);
    this.formControl['description'].setValue(this.data.description);
    let d: any = this.data.date;
    this.date = moment(d.replaceAll('-', '/'), "DD/MM/YYYY").toDate();
    this.formControl['date'].setValue(this.date);
  }

  /**
   * Makes merchant/client field send a get request everytime user changes the input name for filtering.
   */
  formValueChanges(): void{
    this.formControl['merchantsCtrl'].valueChanges.subscribe(
      merchant => this.merchantsService.getMerchantsByName(merchant ? merchant : '', 0, 25).subscribe(
        filteredMerchants => {
          this.filteredMerchants = filteredMerchants.pages; //Store filtered merchants.
          this.removeActuals(this.filteredMerchants, this.actualMerchants); //Remove selected merchants from the available list.
    }));
    this.formControl['clientsCtrl'].valueChanges.subscribe(
      client => this.clientsService.getClientsByName(client ? client : '', 0, 25).subscribe(
        filteredClients => {
          this.filteredClients = filteredClients.pages; //Store filtered clients.
          this.removeActuals(this.filteredClients, this.actualClients); //Remove selected clients from the available list.
    }));
  }

  /**
   * Sends a get request for load all available merchants/clients that can be associated to this meeting, after it removes
   * the merchants/client which are associated to this meeting.
   */
  loadAvailableInformation(): void{
    this.loadingService.show();
    this.data.merchants.Merchants.forEach(actualMerchant => this.actualMerchants.push(actualMerchant.name + '/' + actualMerchant.email));
    this.moreThanOneMerchants = this.data.merchants.Merchants.length > 1 ? true : false;
    this.merchantsService.getMerchants(0, 100).subscribe(
      merchants => {
        this.filteredMerchants = merchants.pages; //Store merchants
        merchants.pages.forEach(merchant => this.availableMerchants.push(merchant.idMerchant + '/' + merchant.email));
        this.removeActuals(this.filteredMerchants, this.actualMerchants);
        this.loadingService.hide();
    });
    this.data.clients.Clients.forEach(actualClient => this.actualClients.push(actualClient.name + '/' + actualClient.email));
    this.moreThanOneClients = this.data.clients.Clients.length > 1 ? true : false;
    this.clientsService.getClients(0, 100).subscribe(
      clients => {
        this.filteredClients = clients.pages;
        clients.pages.forEach(client => this.availableClients.push(client.idClient + '/' + client.email));
        this.removeActuals(this.filteredClients, this.actualClients);
        this.loadingService.hide();
    });
  }

  /**
  * Extract the selected merchants/clients from available merchants/clients.
  * @param availableSubjects List of available subjects that user can associate(this has the previously associated subjects).
  * @param actualSubjects Actual associated subjects, they have to be removed from the availableSubjects list.
  */
  removeActuals(availableSubjects: any[], actualSubjects: string[]){
    //Search indexes to the elements to remove
    let indexes: number[] = []; // Indexes to remove
    actualSubjects.forEach(actualSubject => { // actualSubjects has strings like : "Armando/armando@gmail.com"
      for(var i = 0; i < availableSubjects.length; i++){ // availableSubjects has merchant/client objects then we use the email attribute for compare:
        if(availableSubjects[i].email.localeCompare(actualSubject.split('/')[EMAIL_INDEX]) === 0){ // Compare email attribute with the email of the given actualSubject.
          indexes.push(i); //Storing the indexes for remove.
          break; //End loop.
    }}});
    //Remove elements, first is needed to sort indexes before removing.
    indexes = indexes.sort((a, b) => a - b);
    for (var index = indexes.length -1; index >= 0; index--) // We remove the indexes higher to lower, otherwise we can have a wrong output.
      availableSubjects.splice(indexes[index], 1);
  }

  /*
  When user removes a chip in merchant chip list this method is called with
  the deleted element as input => the deleted element has
  this syntax "Armando/armando@gmail.com", we need the email
  so we use the second splited string by split('/').
  After that we get its ID and make a delete request.
  */
  removeMerchant(event: MatChipEvent, merchant: string): void {
    let idSubject = this.searchSubjectId(merchant, this.availableMerchants); //Get ID.
    this.loadingService.show();
    this.meetingService.deleteMeetingMerchant(this.data.idMeeting, idSubject).subscribe(
      _ => {
        this.updateMerchantAutocomplete(idSubject);
        this.actualMerchants.splice(this.actualMerchants.indexOf(merchant), 1) //Removes merchant in the given array
        this.moreThanOneMerchants = this.actualMerchants.length > 1 ? true : false;
    });
  }

/**
 * Send a get request for load the information of deleted merchant and adds it to the autocomplete list if the filter term matches with its name.
 * @param idMerchant Merchant to load information.
 */
  updateMerchantAutocomplete(idMerchant: number): void{
    this.merchantsService.getMerchantById(`${idMerchant}`).subscribe(
      merchant => {
        if(merchant.name.includes(this.formControl['merchantsCtrl'].value) === true || !this.formControl['merchantsCtrl'].value)
          this.filteredMerchants.push(merchant);
        this.loadingService.hide();
      }
    );
  }

  /*
  When user removes a chip in client chip list this method is called with
  the deleted element as input => the deleted element has
  this syntax "Cliente Juan/juan@gmail.com", we need the email
  so we use the second splited string by split('/').
  After that we get its ID and make a delete request.
  */
  removeClient(event: MatChipEvent, element: string): void {
    let idSubject = this.searchSubjectId(element, this.availableClients); //Get ID.
    this.loadingService.show();
    this.meetingService.deleteMeetingClient(this.data.idMeeting, idSubject).subscribe(
      _ => {
        this.updateClientAutocomplete(idSubject);
        this.actualClients.splice(this.actualClients.indexOf(element), 1) //Removes element in the given array
        this.moreThanOneClients = this.actualClients.length > 1 ? true : false;
    });
  }

/**
 * Send a get request for load the information of deleted client and adds it to the autocomplete list if the filter term matches with its name.
 * @param idClient Client to load information.
 */
  updateClientAutocomplete(idSubject: number): void{
    this.clientsService.getClientById(`${idSubject}`).subscribe(
      client => {
        if(client.name.includes(this.formControl['clientsCtrl'].value) === true || !this.formControl['clientsCtrl'].value)
          this.filteredClients.push(client);
        this.loadingService.hide();
      }
    );
  }

  /**
  When user removes a chip in keyword chip list this method is called with
  the deleted element as input => this element has the keyword to remove then
  we make a delete request of that keyword.
  * Removes a keyword associated to this meeting and keywords chip list.
  * @param keyword Element to be removed.
  */
  removeKeyword(keyword: string): void {
    this.loadingService.show();
    this.meetingService.deleteMeetingKeyword(this.data.idMeeting, keyword).subscribe( // Make delete request of that keyword.
      _ => {
        this.data.keywords.splice(this.data.keywords.indexOf(keyword), 1) //Removes element in the keywords list.
        this.wordCloudChange();
    });
  }

  /**
   * Sends a post merchant request in the given meeting.
   * @param event Event with merchant information to be added.
   * @param inputName The 'id' HTML attribute for search, extract value and reset input.
   * @param formControl Form field to be reset.
   */
  postMerchant(event: MatAutocompleteSelectedEvent, inputName: string, formControl: FormControl): void {
    let subjectId = this.searchSubjectId(event.option.viewValue, this.availableMerchants); // Get the respective Id of merchant
    this.loadingService.show();
    this.meetingService.postMeetingNewMerchant(this.data.idMeeting, subjectId).subscribe(
      _ => {
        this.actualMerchants.push(event.option.viewValue); //Add element in the given array
        this.moreThanOneMerchants = true;
        this.clearAndResetInput(formControl, inputName);
        this.loadingService.hide();
    });
  }

  /**
   * Sends a post client request in the given meeting.
   * @param event Event with client information to be added.
   * @param inputName The 'id' HTML attribute for search, extract value and reset input.
   * @param formControl Form field to be reset.
   */
  postClient(event: MatAutocompleteSelectedEvent, inputName: string, formControl: FormControl): void {
    let subjectId = this.searchSubjectId(event.option.viewValue, this.availableClients); // Get the respective Id of client
    this.loadingService.show();
    this.meetingService.postMeetingNewClient(this.data.idMeeting, subjectId).subscribe(
      _ => {
        this.actualClients.push(event.option.viewValue); //Add element in the given array
        this.moreThanOneClients = true;
        this.clearAndResetInput(formControl, inputName);
        this.loadingService.hide();
    });
  }

  /**
   * Sends a post keyword request in the given meeting.
   * @param event Event with keyword information to be added.
   * @param inputName The 'id' HTML attribute for search, extract value and reset input.
   * @param formControl Form field to be reset.
   */
  postKeyword(event: MatChipInputEvent): void{
    if(!event.value)
      return;
    this.loadingService.show();
    this.meetingService.postMeetingNewKeyword(this.data.idMeeting, event.value).subscribe( //Send keyword post request.
      _ => {
        this.data.keywords.push(event.value); //Insert keyword in keyword list.
        this.clearAndResetInput(this.formControl["keywordsCtrl"], "keywordInput"); //Reset value.
        this.wordCloudChange();
      },
      _ => this.loadingService.hide()
      );
    }

  /**
   * Clear an input element and set null value in one form field.
   * @param formControl Form field control to set null value.
   * @param inputName The 'id' html attribute of the input to clear its element.
   */
  clearAndResetInput(formControl: FormControl, inputName: string): void{
    let input = document.getElementById(inputName); // Get the respective input.
    input!.nodeValue = ''; //Reset its value.
    formControl.setValue(''); //Reset form value.
  }

  /**
   * Returns ID of the search subject.
   * @param nameAndEmail string with following syntax "Armando/armando@gmail.com" <=> "name/email".
   * @param subjects list of STRINGS with the following syntax "1/armando@gmail.com" <=> "ID/email".
   * @returns the ID of the email that matches with the email of nameAndEmail input string OR NOT_FOUND otherwise
   */
  searchSubjectId(nameAndEmail: string, subjects: string[]): number{
    let email = nameAndEmail.split('/')[EMAIL_INDEX]; //Get email from selected option
    let outputId = NOT_FOUND;
    subjects.forEach(subject => {
      if(email.localeCompare(subject.split('/')[EMAIL_INDEX]) === 0){
          outputId = parseInt(subject.split('/')[ID_INDEX]);
          return;
    }});
    return outputId;
  }

/**
 * Sends a put request for date attribute of this meeting.
 */
 putNewMatter(): void{
   //Only if the form field value has changed from previous value AND the value doens't generate an error => then we make the put request.
  if(this.formControl['matter'].value != this.data.matter && this.getErrorMessage('matter').localeCompare('') === 0){
    this.loadingService.show();
    this.meetingService.putMeetingNewValue(this.data.idMeeting, 'matter', this.formControl['matter'].value).subscribe(
      _ => {
        this.loadingService.hide();
        this.data.matter = this.formControl['matter'].value;
      },
      _ => this.loadingService.hide()
    );
  }
}

/**
 * Sends a put request for date attribute of this meeting.
 */
  putNewDate(): void{
    this.loadingService.show();
    this.meetingService.putMeetingNewValue(this.data.idMeeting, 'date', this.formControl['date'].value.toLocaleDateString('en-GB').replaceAll('/', '-') + ' 00:00')
    .subscribe(
      _ => this.loadingService.hide(),
      _ => this.loadingService.hide()
    );
  }

  /**
 * Sends a put request for description attribute of this meeting.
 */
  putNewDescription(): void{
    if(this.data.description != this.formControl['description'].value){
      this.loadingService.show();
      this.meetingService.putMeetingNewValue(this.data.idMeeting, 'description', this.formControl['description'].value).subscribe(
        _ => {
          this.data.description = this.formControl['description'].value;
          this.wordCloudChange();
        },
        _ => this.loadingService.hide());
    }
  }

  /**
   * Builds a custom error message for the given form field attribute if it doesn't match with their validators.
   * @param formField Form field attribute to validate.
   * @returns A custom error message for the form field attribute or an empty string.
   */
  getErrorMessage(formField: string) : string{
    if(this.formControl[formField].hasError('required'))
      return 'You must enter a value for ' + formField;
    return '';
  }

  goToModifyClient(client): void{
    let clientId = this.searchSubjectId(client, this.availableClients);
    this.close();
    this.router.navigateByUrl(`/clients-modify/${clientId}`);
  }

  buildWordCloudData(): CloudData[]{
    let data: CloudData[] = [];
    let weight: number = Math.max(this.data.wordCloud.length, 10);
    this.data.wordCloud.forEach(word => {
      word = word[0].toUpperCase() + word.substr(1);
      data.push({ text : word, weight : weight--});
    });
    return data;
  }

  wordCloudChange(): void{
    this.meetingService.getWordCloudById(this.data.idMeeting)
    .subscribe(newData => {
      this.data.wordCloud = newData.wordCloud;
      this.wordCloudData = this.buildWordCloudData();
      this.loadingService.hide();
    });
  }

  close(): void{
    this.dialogRef.close();
  }

  fileInputChange(files: FileList) {
    this.loadingService.show();
    this.meetingService.postFile(this.data.idMeeting, files[0]).subscribe(newFile => {
      this.data.files.files.push(newFile);
      this.fileTable.renderRows();
      this.loadingService.hide();
    }, _ => this.loadingService.hide());
  }

  isMp3(file: MeetingFile): boolean{
    return file.fileType.localeCompare('mp3') === 0;
  }

  deleteFile(idMeeting: number, idFile: number, file: MeetingFile): void{
    this.loadingService.show();
    this.meetingService.deleteMeetingFile(idMeeting, idFile).subscribe(_ => {
      this.data.files.files.splice(this.data.files.files.indexOf(file));
      this.fileTable.renderRows();
      this.loadingService.hide();
    }, _ => this.loadingService.hide());
  }

  downloadFile(idMeeting: number, idFile: number, fileName: string, fileType: string): void{
    this.loadingService.show();
    this.meetingService.getMeetingFileById(idMeeting, idFile).subscribe(data => {
      saveAs(new Blob([data], {type: MYME_TYPES[fileType] }), fileName);
      this.data.files.files.push();
      this.loadingService.hide();
    }, _ => this.loadingService.hide() );
  }

  postDescriptionFromFile(idMeeting: number, idFile: number): void{
    this.loadingService.show();
    this.meetingService.postMeetingDescriptionFromFile(idMeeting, idFile).subscribe(meeting => {
      this.data = meeting;
      this.wordCloudData = this.buildWordCloudData();
      this.formControl['description'].setValue(this.data.description);
      this.loadingService.hide();
    }, _ => this.loadingService.hide());
  }
}
