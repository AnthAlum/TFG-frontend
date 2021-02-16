import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-post-merchant',
  templateUrl: './post-merchant.component.html',
  styleUrls: ['./post-merchant.component.css']
})
export class PostMerchantComponent implements OnInit {

  idRol: string = "idRol";
  password: string = "password";
  name: string = "name";
  email: string = "email";
  phone: string = "phone";

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
  }

  postMerchant(): void{
    //const information = [this.idRol, this.password, this.name, this.email, this.phone];
    const information = ["1", "password", "Sujeto", "correo2@example.com", "123456789"];
    this.backendService.postMerchant(information).subscribe(_ => console.log("Posted!"));
  }
}
