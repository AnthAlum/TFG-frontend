import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { LoadingService } from '../loading.service';
import { SnackbarMessageComponent } from '../snackbar-message/snackbar-message.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { BackendClientsService } from '../backend-clients.service';

@Component({
  selector: 'app-post-client',
  templateUrl: './post-client.component.html',
  styleUrls: ['./post-client.component.css']
})
export class PostClientComponent implements OnInit {
  regexSet = this.clientsService.getValuesRegex();

  checkoutForm: FormGroup = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    company: new FormControl('', [Validators.required, Validators.min(4)]),
    phone: new FormControl('', [Validators.required, Validators.pattern(this.regexSet.phone)]),
    name: new FormControl('', [Validators.required, Validators.pattern(this.regexSet.name), Validators.min(4)])
  });

  constructor(
    private clientsService: BackendClientsService,
    private formBuilder: FormBuilder,
    private snackBar: SnackbarMessageComponent,
    private loadingService: LoadingService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loadingService.hide();
  }

  post(): void{
    if(!this.isFormSendable())
      return;
    let action: string = "Create";
    let order = ["name", "email", "phone", "company"];
    const information : { [key: string]: string } = {
      'name': this.checkoutForm.get('name')!.value,
      'phone': this.checkoutForm.get('phone')!.value,
      'email': this.checkoutForm.get('email')!.value,
      'company': this.checkoutForm.get('company')!.value
    };
    const dialogRef = this.dialog.open(DialogConfirmationComponent,{
      data: [ information, order, action]
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadingService.show();
      if(result.event === action)
        this.postMerchant(information);
      else
        this.loadingService.hide();
    });

  }

  isFormSendable(): boolean{
    for(const field in this.checkoutForm.controls){
      if(this.checkoutForm.get(field)!.hasError('required') || this.checkoutForm.get(field)?.hasError('pattern'))
        return false;
    }
    return true;
  }

  postMerchant(information: { [key: string]: string }): void{
    if(this.clientsService.verifyAllValues(information)){
      this.loadingService.show();
      this.clientsService.postClient(information)
        .subscribe(
          _ => {
            this.snackBar.openSnackBar("Client successfully created!", "Okey");
            this.loadingService.hide();
          },
          error => {
            this.proccessError(error);
            this.loadingService.hide();
          }
        );
    }
  }

  proccessError(error: HttpErrorResponse): void{
    if(error.status === 403)
      this.snackBar.openSnackBar("You are not allowed to create a new user", "Okey");
    if(error.status === 400)
      this.snackBar.openSnackBar("This email is already registered", "Got it");
  }

  getErrorMessage(attribute: string): string{
    if(this.checkoutForm.get(attribute)!.hasError('required'))
      return 'You must insert a ' + attribute;
    if(this.checkoutForm.get(attribute)!.hasError('pattern'))
      return 'Not a valid ' + attribute;
    return '';
  }
}
