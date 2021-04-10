import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, FormsModule, Validators} from '@angular/forms';
import { BackendService } from '../backend.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarMessageComponent } from '../snackbar-message/snackbar-message.component';
import { LoadingService } from '../loading.service';
import { BackendClientsService } from '../backend-clients.service';
import { Client } from '../client';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { Meeting } from '../meeting';
import { MatTable } from '@angular/material/table';
import { MeetingSimplifiedResponse } from '../meeting-simplified-response';
import { BackendMeetingsService } from '../backend-meetings.service';
import { MeetingDetailComponent } from '../meeting-detail/meeting-detail.component';

@Component({
  selector: 'app-put-client',
  templateUrl: './put-client.component.html',
  styleUrls: ['./put-client.component.css']
})
export class PutClientComponent implements OnInit {

  regexSet = this.clientsService.getValuesRegex();

  formControl: { [key: string]: FormControl } = {
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(this.regexSet.phone)]),
    name: new FormControl('', [Validators.required, Validators.pattern(this.regexSet.name), Validators.min(4)]),
    company: new FormControl('', [Validators.required, Validators.pattern(this.regexSet.company)]),
  };

  client: Client = null;
  checkoutForm = this.formBuilder.group({
    company: '',
    name: '',
    email: '',
    phone: '',
  });

  //Meeting table variables
  @ViewChild(MatTable) fileTable: MatTable<MeetingSimplifiedResponse>;
  displayedColumns: string[] = ['matter', 'date', 'merchants', 'clients'];

  constructor(
    private clientsService: BackendClientsService,
    private formBuilder: FormBuilder,
    private activatedRouter: ActivatedRoute,
    private snackBar: SnackbarMessageComponent,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private meetingsService: BackendMeetingsService,
  ) { }

  ngOnInit(): void {
    const clientId = this.activatedRouter.snapshot.paramMap.get('clientId');
    if(clientId)
      this.clientsService.getClientById(clientId)
        .subscribe(
          client => {
            this.setValues(client);
            this.loadingService.hide();
          },
          error => {
            this.loadingService.hide();
          }
        );
  }

  askForChange(attribute: string): void{
    let action: string = "Modify";
    let order = [ `current ${attribute}`, `new ${attribute}` ]
    let information: {[key: string]: string}= {};
    //information[`current ${attribute}`] = this.client[attribute];
    information[`new ${attribute}`] = this.getValue(attribute);
    const dialogRef = this.dialog.open(DialogConfirmationComponent,{
      data: [ information, order, action]
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadingService.show();
      if(result.event === action)
        this.changeValue(attribute);
      else
        this.loadingService.hide();
    });
  }

  changeValue(attribute: string): void{
    let value = this.getValue(attribute);
    if(this.clientsService.verifyValue(attribute, value)){
      this.clientsService.putClientNewValue(this.client.idClient, attribute, value)
        .subscribe(
          (client: any) => {
            this.snackBar.openSnackBar("The client's " + attribute + " has been changed", "Okey");
            this.loadingService.hide();
          },(error: any) => {
            this.loadingService.hide();
           }
        );
      this.loadingService.show();
    }
  }

  getValue(attribute: string): string{
    let value = undefined;
    switch(attribute){
      case "name":
        value = this.checkoutForm.value.name;
        break;
      case "phone":
        value = this.checkoutForm.value.phone;
        break;
      case "email":
        value = this.checkoutForm.value.email;
        break;
      case "company":
        value = this.checkoutForm.value.company;
        break;
    }
    return value;
  }

  getErrorMessage(attribute: string): string{
    if(this.formControl[attribute].hasError('required'))
      return 'You must insert a ' + attribute;
    if(this.formControl[attribute].hasError('pattern'))
      return 'Not a valid ' + attribute;
    return '';
  }

  setValues(client: Client): void{
    this.client = client;
    this.checkoutForm.setValue({
      'name': this.client.name,
      'phone': this.client.phone,
      'email': this.client.email,
      'company': this.client.company,
    });
    this.formControl.name.setValue(this.client.name);
    this.formControl.email.setValue(this.client.email);
    this.formControl.phone.setValue(this.client.phone);
    this.formControl.company.setValue(this.client.company);
  }

  showData(meeting: Meeting): void{
    this.loadingService.show();
    this.meetingsService.getMeetingById(meeting.idMeeting).subscribe(meetingUpdated => {
      const dialogRef = this.dialog.open(MeetingDetailComponent, {
        data: meetingUpdated,
        height: '90%',
        width: '100%',
      });
      dialogRef.afterClosed().subscribe(_ => {
        this.clientsService.getClientById(this.activatedRouter.snapshot.paramMap.get('clientId')!).subscribe(client => {
          this.client = client;
          this.loadingService.hide();
        }, _ => this.loadingService.hide()); //Error in this.clientsService.getClientById
      }, _ => this.loadingService.show()); //Error in dialogRef.afterClosed()
    }, _ => this.loadingService.hide()); //Error in meetingsService.getMeetingById
  }
}
