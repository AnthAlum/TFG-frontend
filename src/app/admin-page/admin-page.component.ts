import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  merchants: any = undefined;
  postOption: boolean = false;
  putOption: boolean = false;

  constructor(
    private router:Router,
    private backendService: BackendService
    ) { }

  ngOnInit(): void {
  }

  getMerchants(): void{
    this.backendService.getMerchants().subscribe(
      merchants => { 
        this.merchants = merchants.Merchants; 
        this.router.navigateByUrl("/merchants/overview");
      }
    );
  }

  postMerchant(): void{
    this.router.navigateByUrl("/merchants/add");
  }

  putMerchant(): void{
    this.router.navigateByUrl("/merchants/modify");
  }
}
