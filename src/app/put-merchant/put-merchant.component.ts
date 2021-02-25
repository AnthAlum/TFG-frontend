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

  idRol: string = "idRol";
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
    const routeParams = this.activatedRouter.snapshot.paramMap;
    const merchantId = routeParams.get('merchantId');
    if(merchantId)
      this.backendService.getMerchantById(merchantId)
        .subscribe( 
          merchant => this.setValues(merchant), 
          error => this.proccessError(error)
        );
  }

  changeName(): void{
    //TODO: Hacer comprobaciones sobre el atributo
    this.backendService.putMerchantName(this.merchant.idMerchant, this.checkoutForm.value.name)
      .subscribe(_ => console.log('name updated')); //TODO: Hay que mostrar de una buena manera que los datos se han actualizado. 
  }

  changePhone(): void{
    //TODO: Hacer comprobaciones sobre el atributo
    this.backendService.putMerchantPhone(this.merchant.idMerchant, this.checkoutForm.value.phone)
      .subscribe(_ => console.log('phone updated')); //TODO: Hay que mostrar de una buena manera que los datos se han actualizado. 
  }

  changeEmail(): void{
    //TODO: Hacer comprobaciones sobre el atributo
    this.backendService.putMerchantEmail(this.merchant.idMerchant, this.checkoutForm.value.email)
      .subscribe(_ => console.log('email update')); //TODO: Hay que mostrar de una buena manera que los datos se han actualizado. 
  }

  changeRole(): void{
    //TODO: Hacer comprobaciones sobre el atributo
    this.backendService.putMerchantRole(this.merchant.idMerchant, this.checkoutForm.value.idRol)
      .subscribe(_ => console.log('role update')); //TODO: Hay que mostrar de una buena manera que los datos se han actualizado. 
  }

  changePassword(): void{
    //TODO: Hacer comprobaciones sobre el atributo
    this.backendService.putMerchantPassword(this.merchant.idMerchant, this.checkoutForm.value.password)
      .subscribe(_ => console.log('password update')); //TODO: Hay que mostrar de una buena manera que los datos se han actualizado. 
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
}
