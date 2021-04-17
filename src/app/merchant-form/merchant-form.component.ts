import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-merchant-form',
  templateUrl: './merchant-form.component.html',
  styleUrls: ['./merchant-form.component.css']
})
export class MerchantFormComponent implements OnInit {

  methodName: string = "";

  checkoutForm = this.formBuilder.group({
    idRol: '',
    password: '',
    name: '',
    email: '',
    phone: '',
  });

  post: string = "post";
  put: string = "put";

  constructor(
    private backendService: BackendService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    if(window.location.href.includes("modify"))
      this.methodName = "put";
    if(window.location.href.includes("add"))
      this.methodName = "post";
  }

  //En funcion del valor de la variable method haremos una peticion http post o put.
  doRequestPost(): void{
    if(this.equals(this.methodName, this.post))
      this.backendService.postMerchant(this.getData()).subscribe(_ => console.log("Posted!"));
  }


  getData(): { [key: string]: string }{
    return {
      'idRole': this.checkoutForm.get('idRol')?.value,
      'password': this.checkoutForm.get('password')?.value,
      'name': this.checkoutForm.get('name')?.value,
      'email': this.checkoutForm.get('email')?.value,
      'phone': this.checkoutForm.get('phone')?.value };
  }

  equals(val1: string, val2: string): boolean{
    if(val1.localeCompare(val2) === 0)
      return true;
    return false;
  }
}
