import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-post-merchant',
  templateUrl: './post-merchant.component.html',
  styleUrls: ['./post-merchant.component.css']
})

export class PostMerchantComponent implements OnInit {

  responseMessage: any = undefined;
  
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
          _ => this.responseMessage = 'posted', 
          error => this.proccessError(error)
        );
    //TODO: Hay que mostrar que datos fallan en el formulario.
  }

  proccessError(error: HttpErrorResponse): void{
    if(error.status === 403){
      this.responseMessage = "Forbidden";
    }
    if(error.status === 400){
      this.responseMessage = "already registered";
    }
  }
}
