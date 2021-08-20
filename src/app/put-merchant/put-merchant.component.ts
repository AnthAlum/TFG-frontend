import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import { BackendService } from '../backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarMessageComponent } from '../snackbar-message/snackbar-message.component';
import { LoadingService } from '../loading.service';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { UsersessionService } from '../usersession.service';
import { Merchant } from '../merchant';
import { Meeting } from '../meeting';
import { MeetingDetailComponent } from '../meeting-detail/meeting-detail.component';
import { BackendMeetingsService } from '../backend-meetings.service';
import { MatTable } from '@angular/material/table';
import { MeetingSimplifiedResponse } from '../meeting-simplified-response';

@Component({
  selector: 'app-put-merchant',
  templateUrl: './put-merchant.component.html',
  styleUrls: ['./put-merchant.component.css']
})
export class PutMerchantComponent implements OnInit {

  regexSet = this.backendService.getValuesRegex();

  merchant: Merchant | null = null;
  checkoutForm = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.pattern(this.regexSet.email)]),
    password: new FormControl('', [Validators.required, Validators.min(8)]),
    newPassword: new FormControl('', [Validators.required, Validators.min(8)]),
    phone: new FormControl('', [Validators.required, Validators.pattern(this.regexSet.phone)]),
    name: new FormControl('', [Validators.required, Validators.pattern(this.regexSet.name), Validators.min(4)]),
    idRole: new FormControl(''),
  });

  //Meeting table variables
  @ViewChild(MatTable) fileTable: MatTable<MeetingSimplifiedResponse>;
  displayedColumns: string[] = ['matter', 'date', 'merchants', 'clients'];

  constructor(
    private backendService: BackendService,
    private formBuilder: FormBuilder,
    private activatedRouter: ActivatedRoute,
    private snackBar: SnackbarMessageComponent,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private usersessionService: UsersessionService,
    private meetingsService: BackendMeetingsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const merchantId = parseInt(this.activatedRouter.snapshot.paramMap.get('merchantId')!);
    if(merchantId === this.usersessionService.getId() || this.usersessionService.isAdmin())
      this.loadMerchant(`${merchantId}`);
    else
      this.router.navigateByUrl(`/merchants-modify/${this.usersessionService.getId()}`);

  }

  loadMerchant(merchantId: string): void{
    this.loadingService.show();
    this.backendService.getMerchantById(merchantId).subscribe(
      merchant => {
          this.setValues(merchant);
          this.loadingService.hide();
        }, _ => {
          console.log("Error");
          this.loadingService.hide();
        });
  }

  askForChangeValue(attribute: string): void{
    if(this.getErrorMessage(attribute).localeCompare('') !== 0)
      return;
    if(attribute.localeCompare("password") === 0)
      this.changePassword();
    let action: string = "Modify";
    let order = [ `current ${attribute}`, `new ${attribute}` ]
    let information: {[key: string]: string}= {};
    information[`current ${attribute}`] = this.merchant![attribute];
    if(attribute.localeCompare('idRole') === 0){
      information[`current idRole`] = this.merchant!.idRole === 0 ? "ADMIN" : "MERCHANT";
      information[`new idRole`] = this.getValue('idRole').localeCompare("0") === 0 ? "ADMIN" : "MERCHANT";
    }
    else{
      information[`current ${attribute}`] = this.merchant![attribute];
      information[`new ${attribute}`] = this.getValue(attribute);
    }
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
    if(attribute.localeCompare('idRole') === 0)
      this.changeRole('idRole');
    let value = this.getValue(attribute);
    if(this.backendService.verifyValue(attribute, value)){
      this.loadingService.show();
      this.backendService.putMerchantNewValue(this.merchant!.idMerchant, attribute, value).subscribe(_ => {
        this.snackBar.openSnackBar("Your " + attribute + " has been changed", "Okey");
        this.loadingService.hide();
        this.loadMerchant(`${this.merchant!.idMerchant}`);
      }, _ => this.loadingService.hide());
    }
  }

  changeRole(attribute: string): void{
    let value = this.getValue(attribute);
    if(this.backendService.verifyValue(attribute, value)){
      this.backendService.putMerchantNewValue(this.merchant!.idMerchant, attribute, value)
        .subscribe(
          _ => {
            this.snackBar.openSnackBar("Your " + attribute + " has been changed", "Okey");
            this.usersessionService.role = value === "0" ? 'ROLE_ADMIN' : 'ROLE_USER';
            this.loadingService.hide();
          }, _ => this.loadingService.hide());
      this.loadingService.show();
    }
  }

  changePassword(): void{
    let passwordValue = this.getValue("password");
    let newPasswordValue = this.getValue("newPassword");
    if(!this.checkoutForm.get('password')?.invalid || !this.checkoutForm.get('newPassword')?.invalid){
      this.backendService.putMerchantPassword(this.merchant!.idMerchant, passwordValue, newPasswordValue)
        .subscribe(
          _ => {
            this.snackBar.openSnackBar("Your password has been changed", "Okey");
            this.loadingService.hide();
          }, _ => {
            this.snackBar.openSnackBar("The actual password doens't match", "Okey");
            this.loadingService.hide();
          });
      this.loadingService.show();
    }
  }

  getValue(attribute: string): string{
    let value: string = '';
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
      case "idRole":
        value = this.checkoutForm.value.idRole;
        break;
      case "password":
        value = this.checkoutForm.value.password;
        break;
      case "newPassword":
        value = this.checkoutForm.value.newPassword;
        break;
    }
    return value;
  }

  getErrorMessage(attribute: string): string{
    if(this.checkoutForm.get(attribute)!.hasError('required'))
      return 'You must insert a ' + attribute;
    if(this.checkoutForm.get(attribute)!.hasError('pattern'))
      return 'Not a valid ' + attribute;
    return '';
  }

  getErrorMessagePassword(attribute: string): string{
    if(this.checkoutForm.get(attribute)?.hasError('min'))
      return 'Password minimum length is 8 letters';
    return ''
  }

  setValues(merchant: Merchant): void{
    merchant = this.changeDates(merchant);
    this.merchant = merchant;
    let role: string = "0";
    if(this.merchant.idRole === 1)
      role = "1";
    this.checkoutForm.setValue({
      'name': this.merchant.name,
      'phone': this.merchant.phone,
      'email': this.merchant.email,
      'idRole': role,
      'password': '',
      'newPassword': '',
    });
  }

  changeDates(merchant: Merchant): Merchant{
    merchant.meetings.simplifiedList.forEach(meeting => meeting.date = meeting.date.substr(0, 10));
    return merchant;
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
        this.backendService.getMerchantById(this.activatedRouter.snapshot.paramMap.get('merchantId')!).subscribe(merchant => {
          this.merchant = merchant;
          this.loadingService.hide();
        }, errorMerchant => this.loadingService.hide()); //Error in this.merchantsService.getClientById
      }, errorDialog => this.loadingService.show()); //Error in dialogRef.afterClosed()
    }, errorMeeting => this.loadingService.hide()); //Error in meetingsService.getMeetingById
  }
}
