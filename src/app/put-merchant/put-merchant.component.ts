import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormsModule} from '@angular/forms';
import { BackendService } from '../backend.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-put-merchant',
  templateUrl: './put-merchant.component.html',
  styleUrls: ['./put-merchant.component.css']
})
export class PutMerchantComponent implements OnInit {
  
  merchant: any;
  updated: string = "";
  idRole: string = "idRol";
  password: string = "password";
  name: string = "name";
  email: string = "email";
  phone: string = "phone";
  checkoutForm = this.formBuilder.group({
    idRole: '',
    password: '',
    name: '',
    email: '',
    phone: '',
  });

  constructor(
    private backendService: BackendService,
    private formBuilder: FormBuilder,
    private activatedRouter: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    //TODO: Hay que mostrar algo si se accede a un ID no registrado
    const routeParams = this.activatedRouter.snapshot.paramMap;
    const merchantId = routeParams.get('merchantId');
    if(merchantId)
      this.backendService.getMerchantById(merchantId)
        .subscribe( 
          merchant => this.setValues(merchant), 
          error => this.proccessError(error)
        );
  }

  changeValue(attribute: string): void{
    let value = this.getValue(attribute);
    if(this.backendService.verifyValue(attribute, value))
      this.backendService.putMerchantNewValue(this.merchant.idMerchant, attribute, value)
        .subscribe(
          _ => this.changedAttribute(attribute),
          error => { 
            console.log(error);
            this.updated = "";
          }
        );
    else
      console.log(attribute + ' = ' + value);
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
    }
    return value;
  }

  
  proccessError(error: HttpErrorResponse): void{
    //TODO: Implementar
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
      'password': ''
    });
  }

  changedAttribute(attribute: string): void{
    this.updated = attribute;
  }
}
