import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { BackendService } from '../backend.service';
import { LoadingService } from '../loading.service';
import { SnackbarMessageComponent } from '../snackbar-message/snackbar-message.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { Router } from '@angular/router';
import { UsersessionService } from '../usersession.service';


@Component({
  selector: 'app-post-merchant',
  templateUrl: './post-merchant.component.html',
  styleUrls: ['./post-merchant.component.css']
})
export class PostMerchantComponent implements OnInit {

  regexSet = this.backendService.getValuesRegex();

  checkoutForm: FormGroup = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.min(4)]),
    phone: new FormControl('', [Validators.required, Validators.pattern(this.regexSet.phone)]),
    name: new FormControl('', [Validators.required, Validators.pattern(this.regexSet.name), Validators.min(4)]),
    idRole: new FormControl('', [Validators.required, Validators.pattern(this.regexSet.idRole)])
  });

  constructor(
    private backendService: BackendService,
    private formBuilder: FormBuilder,
    private snackBar: SnackbarMessageComponent,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private router: Router,
    private usersessionService: UsersessionService,
  ) { }

  ngOnInit(): void {
    if(!this.usersessionService.isAdmin())
      this.router.navigateByUrl('/clients-add');
    this.loadingService.hide();
  }

  post(): void{
    if(!this.isFormSendable())
      return;
    let action: string = "Create";
    let order = ["name", "email", "phone", "idRole"];
    const information : { [key: string]: string } = {
      'name': this.checkoutForm.get('name')!.value,
      'phone': this.checkoutForm.get('phone')!.value,
      'email': this.checkoutForm.get('email')!.value,
      'password': this.checkoutForm.get('password')!.value,
      'idRole': this.checkoutForm.get('idRole')!.value
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
    if(this.backendService.verifyAllValues(information)){
      this.loadingService.show();
      this.backendService.postMerchant(information)
        .subscribe(
          _ => {
            this.snackBar.openSnackBar("Merchant successfully created!", "Okey");
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
