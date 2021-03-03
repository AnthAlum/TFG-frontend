import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormsModule, Validators} from '@angular/forms';
import { BackendService } from '../backend.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarMessageComponent } from '../snackbar-message/snackbar-message.component';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-put-merchant',
  templateUrl: './put-merchant.component.html',
  styleUrls: ['./put-merchant.component.css']
})
export class PutMerchantComponent implements OnInit {
  
  regexSet = this.backendService.getValuesRegex();

  formControl: { [key: string]: FormControl } = {
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(this.regexSet.phone)]),
    name: new FormControl('', [Validators.required, Validators.pattern(this.regexSet.name), Validators.min(4)]),
    idRole: new FormControl('', [Validators.required, Validators.pattern(this.regexSet.idRole)]),
    password: new FormControl('', [Validators.required, Validators.min(4)]),
    newPassword: new FormControl('', [Validators.required, Validators.min(4)]),
  };

  merchant: any;
  checkoutForm = this.formBuilder.group({
    idRole: '',
    name: '',
    email: '',
    phone: '',
  });

  constructor(
    private backendService: BackendService,
    private formBuilder: FormBuilder,
    private activatedRouter: ActivatedRoute,  
    private snackBar: SnackbarMessageComponent,
    private loadingService: LoadingService,
  ) { }

  ngOnInit(): void {
    //TODO: Hay que mostrar algo si se accede a un ID no registrado
    const routeParams = this.activatedRouter.snapshot.paramMap;
    const merchantId = routeParams.get('merchantId');
    if(merchantId)
      this.backendService.getMerchantById(merchantId)
        .subscribe( 
          merchant => {
            this.setValues(merchant);
            this.loadingService.hide();
          }, 
          error => {
            console.log("Error");
            this.loadingService.hide();
          }
        );
  }

  changeValue(attribute: string): void{
    let value = this.getValue(attribute);
    if(this.backendService.verifyValue(attribute, value)){
      this.backendService.putMerchantNewValue(this.merchant.idMerchant, attribute, value)
        .subscribe(
          (merchant: any) => {
            this.snackBar.openSnackBar("Your " + attribute + " has been changed", "Okey");
            this.loadingService.hide();
          },(error: any) => {
            this.loadingService.hide();
           }
        );
      this.loadingService.show();
    }
  }

  changePassword(): void{
    let password: string = "password";
    let newPassword: string = "newPassword";
    let passwordValue = this.getValue(password);
    let newPasswordValue = this.getValue(newPassword);
    if(this.backendService.verifyValue(password, newPasswordValue)){
      this.backendService.putMerchantPassword(this.merchant.idMerchant, passwordValue, newPassword)
        .subscribe(
          (merchant: any) => {
            this.snackBar.openSnackBar("Your " + password + " has been changed", "Okey");
            this.loadingService.hide();
          },(error: any) => { 
            this.snackBar.openSnackBar("The actual password doens't match", "Okey");
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
    if(this.formControl[attribute].hasError('required'))
      return 'You must insert a ' + attribute;
    if(this.formControl[attribute].hasError('pattern'))
      return 'Not a valid ' + attribute;
    return '';
  }

  getErrorMessagePassword(): string {
    let attribute = "password";
    if(this.formControl[attribute].hasError('required'))
      return 'You must insert a ' + attribute;
    if(this.formControl[attribute].hasError('pattern'))
      return 'Not a valid ' + attribute;
    if(this.getValue(attribute).localeCompare(this.merchant.password) !== 0)
      return 'The password is incorrect';
    return '';
  }

  setValues(merchant: any): void{
    this.merchant = merchant;
    let role: string = "0";
    if(this.merchant.idRol === 1)
      role = "1";
    this.checkoutForm.setValue({
      'name': this.merchant.name,
      'phone': this.merchant.phone,
      'email': this.merchant.email,
      'idRole': role,
    });
    this.formControl.name.setValue(this.merchant.name);
    this.formControl.email.setValue(this.merchant.email);
    this.formControl.phone.setValue(this.merchant.phone);
    this.formControl.idRole.setValue(this.merchant.idRole);
  }
}
