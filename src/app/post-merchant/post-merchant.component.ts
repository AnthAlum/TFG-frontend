import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-post-merchant',
  templateUrl: './post-merchant.component.html',
  styleUrls: ['./post-merchant.component.css']
})

export class PostMerchantComponent implements OnInit {

  
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

  postMerchant(): void{
    const information = [ this.checkoutForm.get('idRol'), this.checkoutForm.get('password'), this.checkoutForm.get('name'), this.checkoutForm.get('email'), this.checkoutForm.get('phone') ];
    //const information = ["1", "password", "Sujeto", "correo2@example.com", "123456789"];
    this.backendService.postMerchant(information).subscribe(_ => console.log("Posted!"));
  }
}
