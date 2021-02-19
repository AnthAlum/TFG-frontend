import { Component, OnInit } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {FormBuilder, FormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { BackendService } from '../backend.service';
@Component({
  selector: 'app-put-merchant',
  templateUrl: './put-merchant.component.html',
  styleUrls: ['./put-merchant.component.css']
})
export class PutMerchantComponent implements OnInit {
  
  idRol: string = "idRol";
  password: string = "password";
  name: string = "name";
  email: string = "email";
  phone: string = "phone";
  checkoutForm = this.formBuilder.group({
    idRol: '',
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

  putMerchant(): void{
    //const information1 = [ this.checkoutForm.get('idRol'), this.checkoutForm.get('password'), this.checkoutForm.get('name'), this.checkoutForm.get('email'), this.checkoutForm.get('phone') ];
    const information = ["1", "password", "Sujeto", "correo2@example.com", "123456789"];
    this.backendService.putMerchant("password", this.password).subscribe(
      _ => console.log('Updated!')
    );
  }
}
