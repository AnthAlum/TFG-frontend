import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormsModule, Validators} from '@angular/forms';
import { BackendService } from '../backend.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarMessageComponent } from '../snackbar-message/snackbar-message.component';
import { LoadingService } from '../loading.service';
import { BackendClientsService } from '../backend-clients.service';
import { Client } from '../client';

@Component({
  selector: 'app-put-client',
  templateUrl: './put-client.component.html',
  styleUrls: ['./put-client.component.css']
})
export class PutClientComponent implements OnInit {

  regexSet = this.clientsService.getValuesRegex();

  formControl: { [key: string]: FormControl } = {
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(this.regexSet.phone)]),
    name: new FormControl('', [Validators.required, Validators.pattern(this.regexSet.name), Validators.min(4)]),
    company: new FormControl('', [Validators.required, Validators.pattern(this.regexSet.company)]),
  };

  client: Client;
  checkoutForm = this.formBuilder.group({
    company: '',
    name: '',
    email: '',
    phone: '',
  });

  constructor(
    private clientsService: BackendClientsService,
    private formBuilder: FormBuilder,
    private activatedRouter: ActivatedRoute,  
    private snackBar: SnackbarMessageComponent,
    private loadingService: LoadingService,
  ) { }

  ngOnInit(): void {
    //TODO: Hay que mostrar algo si se accede a un ID no registrado
    const routeParams = this.activatedRouter.snapshot.paramMap;
    const clientId = routeParams.get('clientId');
    if(clientId)
      this.clientsService.getClientById(clientId)
        .subscribe( 
          client => {
            this.setValues(client);
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
    if(this.clientsService.verifyValue(attribute, value)){
      this.clientsService.putClientNewValue(this.client.idClient, attribute, value)
        .subscribe(
          (client: any) => {
            this.snackBar.openSnackBar("The client's " + attribute + " has been changed", "Okey");
            this.loadingService.hide();
          },(error: any) => {
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
      case "company":
        value = this.checkoutForm.value.company;
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

  setValues(client: Client): void{
    this.client = client;
    this.checkoutForm.setValue({
      'name': this.client.name,
      'phone': this.client.phone,
      'email': this.client.email,
      'company': this.client.company,
    });
    this.formControl.name.setValue(this.client.name);
    this.formControl.email.setValue(this.client.email);
    this.formControl.phone.setValue(this.client.phone);
    this.formControl.company.setValue(this.client.company);
  }
}
