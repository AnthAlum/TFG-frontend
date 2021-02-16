import { Component, OnInit } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { BackendService } from '../backend.service';
@Component({
  selector: 'app-put-merchant',
  templateUrl: './put-merchant.component.html',
  styleUrls: ['./put-merchant.component.css']
})
export class PutMerchantComponent implements OnInit {
  
  idRol: string = "newIdRol";
  password: string = "newPassword";
  name: string = "newName";
  email: string = "newEmail";
  phone: string = "newPhone";

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
  }

  putMerchant(): void{
    this.backendService.putMerchant("password", this.password).subscribe(
      _ => console.log('Updated!')
    );
  }
}
