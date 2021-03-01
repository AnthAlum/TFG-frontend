import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { BackendService } from '../backend.service';
import { SnackbarMessageComponent } from '../snackbar-message/snackbar-message.component';


@Component({
  selector: 'app-post-merchant',
  templateUrl: './post-merchant.component.html',
  styleUrls: ['./post-merchant.component.css']
})
export class PostMerchantComponent implements OnInit {

  regexSet = this.backendService.getValuesRegex();

  checkoutForm = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.min(4)]),
    phone: new FormControl('', [Validators.required, Validators.pattern(this.regexSet.phone)]),
    name: new FormControl('', [Validators.required, Validators.pattern(this.regexSet.name), Validators.min(4)]),
    idRole: new FormControl('', [Validators.required, Validators.pattern(this.regexSet.idRole)])
  });

  constructor(
    private backendService: BackendService,
    private formBuilder: FormBuilder,  
    private snackBar: SnackbarMessageComponent
  ) { }

  ngOnInit(): void {
  }

  postMerchant(): void{
    const information : { [key: string]: string } = {
      'name': this.checkoutForm.get('name')?.value, 
      'phone': this.checkoutForm.get('phone')?.value, 
      'email': this.checkoutForm.get('email')?.value, 
      'password': this.checkoutForm.get('password')?.value,
      'idRole': this.checkoutForm.get('idRole')?.value 
    };
    if(this.backendService.verifyAllValues(information))
      this.backendService.postMerchant(information)
        .subscribe(
          _ => this.snackBar.openSnackBar("Merchant successfully created!", "Okey"), 
          error => this.proccessError(error)
        );
  }

  proccessError(error: HttpErrorResponse): void{
    if(error.status === 403)
      this.snackBar.openSnackBar("You are not allowed to create a new user", "Okey");
    if(error.status === 400)
      this.snackBar.openSnackBar("This email is already registered", "Got it");
  }

  getErrorMessage(attribute: string): string{
    if(this.checkoutForm.get(attribute)?.hasError('required'))
      return 'You must insert a ' + attribute;
    if(this.checkoutForm.get(attribute)?.hasError('pattern'))
      return 'Not a valid ' + attribute;
    return '';
  }
}
