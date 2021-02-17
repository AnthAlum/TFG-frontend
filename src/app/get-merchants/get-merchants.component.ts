import { Component, OnInit, Input } from '@angular/core';
import { BackendService } from '../backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-get-merchants',
  templateUrl: './get-merchants.component.html',
  styleUrls: ['./get-merchants.component.css']
})
export class GetMerchantsComponent implements OnInit {

  @Input() merchants: any = undefined;
  displayedColumns: string[] = ['id', 'idRol', 'nombre', 'email', 'telefono'];
  
  constructor(
    private backendService: BackendService,
    private router:Router
  ) { }


  ngOnInit(): void {
    this.backendService.getMerchants().subscribe(
      merchants => { 
        this.merchants = merchants.Merchants;
        console.log("Never reach this point");
      }
    );
  }

  deleteMerchant(idMerchant: string):void{
    this.backendService.deleteMerchant(idMerchant).subscribe(_ => console.log('Deleted!'));
  }

  putMerchant(idMerchant: string): void{
    this.backendService.setMerchantId(idMerchant);
  }
}