import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BackendMeetingsService } from '../backend-meetings.service';
import { BackendService } from '../backend.service';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { LoadingService } from '../loading.service';
import { Meeting } from '../meeting';
import { MerchantOption } from '../merchant-option';
import { SnackbarMessageComponent } from '../snackbar-message/snackbar-message.component';

@Component({
  selector: 'app-put-meeting',
  templateUrl: './put-meeting.component.html',
  styleUrls: ['./put-meeting.component.css']
})
export class PutMeetingComponent implements OnInit {

  regex = this.meetingsService.getValuesRegex();
  selectedMerchants: MerchantOption[];
  meeting: Meeting;
  merchantList: MerchantOption[];
  //DateTimePicker variables
  format: number = 24;
  formControl: { [key: string]: FormControl } = {
    date: new FormControl('', [Validators.required]),
    time: new FormControl('', [Validators.required]),
    matter: new FormControl(''),
    merchants: new FormControl(''),
    clients: new FormControl(''),
  };
  checkoutForm = this.formBuilder.group({
    date: '',
    time: '',
    matter: '',
    merchants: '',
    clients: '',
  });
  constructor(
    private meetingsService: BackendMeetingsService,
    private formBuilder: FormBuilder,
    private activatedRouter: ActivatedRoute,
    private snackBar: SnackbarMessageComponent,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private backendService: BackendService,
  ) { }

  ngOnInit(): void {
    const routeParams = this.activatedRouter.snapshot.paramMap;
    const meetingId = routeParams.get('meetingId');
    if(meetingId)
      this.meetingsService.getMeetingById(parseInt(meetingId))
        .subscribe(
          meeting => {
            this.setValues(meeting);
          },
          _ => {
            this.loadingService.hide();
          }
        );
  }

  askForChangeValue(attribute: string): void{
    let action: string = "Modify";
    let order = [ `current ${attribute}`, `new ${attribute}` ]
    let information: {[key: string]: string}= {};
    information[`current ${attribute}`] = this.meeting[attribute];
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
    this.meetingsService.putMeetingNewValue(this.meeting.idMeeting, attribute, value)
      .subscribe(
        _ => {
          this.snackBar.openSnackBar("Your " + attribute + " has been changed", "Okey");
          this.loadingService.hide();
        }, _ => this.loadingService.hide()
      );
    this.loadingService.show();
  }

  getValue(attribute: string): string{
    let value = '';
    switch(attribute){
      case "matter":
        value = this.checkoutForm.value.matter;
        break;
      case "date":
        value = moment(this.checkoutForm.value.date).format('DD/MM/YYYY') + ' ' + this.checkoutForm.value.time;
        break;
      case "merchants":
        value = this.checkoutForm.value.merchants;
        break;
      case "clients":
        value = this.checkoutForm.value.clients;
        break;
    }
    return value;
  }

  setValues(meeting: Meeting): void{
    this.meeting = meeting;
    this.selectedMerchants = MerchantOption.toMerchantOption(this.meeting.merchants.Merchants);
    this.backendService.getMerchantsSimplified().subscribe(
      merchantsSimplified => {
        this.merchantList = merchantsSimplified.simplifiedList;
        this.loadingService.hide();
      }
    );
    this.checkoutForm.setValue({
      'matter': this.meeting.matter,
      'date': this.meeting.date,
      'time': this.meeting.time,
      'merchants': this.selectedMerchants,
      'clients': this.meeting.clients,
    });
    this.formControl.matter.setValue(this.meeting.matter);
    this.formControl.date.setValue(this.meeting.date);
    this.formControl.time.setValue(this.meeting.time);
    this.formControl.merchants.setValue(this.selectedMerchants);
    this.formControl.clients.setValue(this.meeting.clients);
  }

  getErrorMessage(attribute: string): string{
    if(this.formControl[attribute].hasError('required'))
      return 'You must insert a ' + attribute;
    if(this.formControl[attribute].hasError('pattern'))
      return 'Not a valid ' + attribute;
    return '';
  }

  compareWith(option1: any, option2: any): boolean{
    return option1.id === option2.id;
  }
}
