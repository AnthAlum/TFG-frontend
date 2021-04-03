import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipEvent, MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { BackendClientsService } from '../backend-clients.service';
import { BackendMeetingsService } from '../backend-meetings.service';
import { BackendService } from '../backend.service';
import { LoadingService } from '../loading.service';
import { Merchant } from '../merchant';
import { NewMeetingBody } from '../new-meeting-body';

const NOT_FOUND: number = -1;
const ID_INDEX: number = 0;
const EMAIL_INDEX: number = 1;

@Component({
  selector: 'app-meeting-create',
  templateUrl: './meeting-create.component.html',
  styleUrls: ['./meeting-create.component.css']
})
export class MeetingCreateComponent implements OnInit {
  fontSize: string = "25px";

  formControl: {[key: string]: FormControl} = {
    matter: new FormControl('', [Validators.required]),
    date: new FormControl(new Date(), [Validators.required]),
    time: new FormControl(''),
    merchantsCtrl: new FormControl(),
    clientsCtrl: new FormControl(),
    description: new FormControl(),
    keywordsCtrl: new FormControl(),
  }


  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  //Merchant chips variables
  errorMerchants = '';
  oneOrMoreMerchants: boolean = false;
  filteredMerchants: Observable<any[]>;
  actualMerchants: string[] = []; //Actual merchants
  merchantIds: number[] = [];
  availableMerchants: string[] = []; //Available merchants
  @ViewChild('merchantInput') merchantInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoMerchant') matAutocompleteMerchants: MatAutocomplete;

  //Client chips variables
  errorClients = '';
  oneOrMoreClients: boolean = false;
  filteredClients: Observable<any[]>;
  actualClients: string[] = []; //Actual clients
  clientIds: number[] = [];
  availableClients: string[] = []; //Available clients
  @ViewChild('clientInput') clientInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoClient') matAutocompleteClients: MatAutocomplete;

  //Keyword chips variables
  filteredKeywords: Observable<any[]>;
  actualKeywords: string[] = []; //Actual clients
  availableKeywords: string[] = []; //Available clients
  @ViewChild('keywordInput') keywordInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoKeyword') matAutocompleteKeywords: MatAutocomplete;
  newKeyword: string = '';

  constructor(
    private loadingService: LoadingService,
    private merchantsService: BackendService,
    private clientsService: BackendClientsService,
    private meetingsService: BackendMeetingsService,
  ) { }

  ngOnInit(): void {
    this.formValueChanges();
    this.loadAvailableInformation();
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
    this.merchantsService.getMerchants(0, 100).subscribe(
      merchants => { //Get all merchants
        this.filteredMerchants = merchants.pages;
        merchants.pages.forEach(merchant => this.availableMerchants.push(merchant.idMerchant + '/' + merchant.email));//Add merchants to the chip list
        this.loadingService.hide();
    });
    this.clientsService.getClients(0, 100).subscribe(
      clients => {
        this.filteredClients = clients.pages;
        clients.pages.forEach(client => this.availableClients.push(client.idClient + '/' + client.email));//Add clients to the chip list
        this.loadingService.hide();
    });
  }

  /**
   * Sends a post request of a new meeting.
   */
  postMeeting(): void{
    if(this.canSendPostRequest()){
      const data: NewMeetingBody = this.buildPostBody();
      this.loadingService.show();
      this.meetingsService.postNewMeeting(data).subscribe(_ => this.loadingService.hide());
      //Reset values after send the post request.
      this.resetFormValues();
    }
  }

  /**
   * Checks if user can send a post request of a new meeting with the given data in the form.
   * @returns True if post request constrains are fulfilled.
   */
  canSendPostRequest(): boolean {
    return this.oneOrMoreMerchants === true && this.oneOrMoreClients === true && this.formControl['matter'].valid == true;
  }

  /**
   * Makes a body for a post request of new meeting.
   * @returns Body with the form data.
   */
  buildPostBody(): NewMeetingBody{
    const body: NewMeetingBody = {
      matter: this.formControl["matter"].value,
        date: this.formControl['date'].value.toLocaleDateString('en-GB').replaceAll('/', '-') + ' 00:00',
        description: this.formControl["description"].value,
        merchants: this.merchantIds,
        clients: this.clientIds,
        keywords: this.actualKeywords,
    };
    return body;
  }

/**
 * Resets form fields.
 */
  resetFormValues(): void{
    this.formControl['matter'].setValue(null);
    this.formControl['description'].setValue(null);
    this.actualKeywords = [];
    this.actualMerchants = [];
    this.actualClients = [];
  }

  /**
   * Returns ID of the search subject.
   * @param nameAndEmail string with following syntax "Armando/armando@gmail.com" <=> "name/email".
   * @param subjects list of STRINGS with the following syntax "1/armando@gmail.com" <=> "ID/email".
   * @returns the ID of the email that matches with the email of nameAndEmail input string OR NOT_FOUND otherwise
   */
  searchSubject(nameAndEmail: string, subjects: string[]): number {
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
   * Adds a merchant to selected merchant chip list.
   * @param event Autocomplete event generated by click one available merchant.
   * @param inputName Input 'id' attribute to be cleared.
   * @param formControl Form field conntrol to reset its value.
   */
  addMerchant(event: MatAutocompleteSelectedEvent, inputName: string, formControl: FormControl): void {
    let subjectId = this.searchSubject(event.option.viewValue, this.availableMerchants); // Get the respective Id of merchant
    this.merchantIds.push(subjectId);
    this.actualMerchants.push(event.option.viewValue); //Add element in the given array
    this.clearAndResetInput(formControl, inputName);
    this.oneOrMoreMerchants = true;
  }

  /**
   * Clear an input element and set null value in one form field.
   * @param formControl Form field control to set null value.
   * @param inputName The 'id' html attribute of the input to clear its element.
   */
  clearAndResetInput(formControl: FormControl, inputName: string): void{
    let input = document.getElementById(inputName); // Get the respective input.
    input!.nodeValue = '';
    formControl.setValue('');
  }

  /**
   * Adds a client to selected client chip list.
   * @param event Autocomplete event generated by click one available client.
   * @param inputName Input 'id' attribute to be cleared.
   * @param formControl Form field conntrol to reset its value.
   */
  addClient(event: MatAutocompleteSelectedEvent, inputName: string, formControl: FormControl): void {
    let subjectId = this.searchSubject(event.option.viewValue, this.availableClients); // Get the respective Id of client
    this.clientIds.push(subjectId);
    this.actualClients.push(event.option.viewValue); //Add element in the given array
    this.clearAndResetInput(formControl, inputName);
    this.oneOrMoreClients = true;
  }

  addKeyword(event: any): void{
    this.actualKeywords.push(event.value);
    this.clearAndResetInput(this.formControl['keywordsCtrl'], 'keywordInput');
  }

  /*
  When user removes a chip in merchant chip list this method is called with
  the deleted element as input => the deleted element has
  this syntax "Armando/armando@gmail.com", we need the email
  so we use the second splited string by split('/').
  After that we get its ID and make a delete request.
  */
  removeMerchant(event: MatChipEvent, merchant: string): void { //Search merchant and remove from array.
    let idSubject = this.searchSubject(merchant, this.availableMerchants);
    this.loadingService.show();
    this.merchantIds.splice(this.merchantIds.indexOf(idSubject), 1); //Remove ID of the picked client.
    this.actualMerchants.splice(this.actualMerchants.indexOf(merchant), 1); //Removes merchant in the given array
    this.updateMerchantAutocomplete(idSubject);
    this.oneOrMoreMerchants = this.merchantIds.length > 0 ? true : false;
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

  /**
   * Removes a client of selected clients chip list.
   * @param event
   * @param client
   */
  removeClient(event: MatChipEvent, client: string): void{
    let idSubject = this.searchSubject(client, this.availableClients);
    this.clientIds.splice(this.clientIds.indexOf(idSubject), 1); //Remove ID of the picked client.
    this.actualClients.splice(this.actualClients.indexOf(client), 1); //Removes client of actualClients array.
    this.updateClientAutocomplete(idSubject);
    this.oneOrMoreClients = this.clientIds.length > 0 ? true : false;
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
  * Removes a keyword of keywords chip list.
  * @param keyword Element to be removed.
  */
  removeKeyword(keyword: string): void {
    this.actualKeywords.splice(this.actualKeywords.indexOf(keyword), 1); //Removes element in the given array
  }

  /**
  * Extract the selected merchants/clients from available merchants/clients.
  * @param availableSubjects List of available subjects that user can associate(this has the previously associated subjects).
  * @param actualSubjects Actual associated subjects, they have to be removed from the availableSubjects list.
  */
  removeActuals(availableSubjects: Observable<any[]>, actualSubjects: string[]){
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

  /**
   * Builds a custom error message for the given form field attribute if it doesn't match with their validators.
   * @param formField Form field attribute to validate.
   * @returns A custom error message for the form field attribute or an empty string.
   */
  getErrorMessage(field: string): string{
    if(this.formControl[field].hasError('required'))
      return 'You must enter a value for matter';
    return '';
  }

  getErrorMessageMerchants(): void{
    this.errorMerchants = this.merchantIds.length === 0 ? 'You must enter one client at least' : '';
  }

  getErrorMessageClients(): void{
    this.errorClients = this.clientIds.length === 0 ? 'You must enter one client at least' : '';
  }
}
