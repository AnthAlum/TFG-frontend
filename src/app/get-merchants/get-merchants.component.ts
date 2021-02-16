import { Component, OnInit, Input } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-get-merchants',
  templateUrl: './get-merchants.component.html',
  styleUrls: ['./get-merchants.component.css']
})
export class GetMerchantsComponent implements OnInit {

  @Input() merchants: any = undefined;
  displayedColumns: string[] = ['id', 'idRol', 'nombre', 'email', 'telefono'];
  
  constructor(
    private backendService: BackendService
  ) { }


  ngOnInit(): void {
  }

  deleteMerchant(idMerchant: string):void{
    this.backendService.deleteMerchant(idMerchant).subscribe(_ => console.log('Deleted!'));
  }

  putMerchant(idMerchant: string): void{
    this.backendService.setMerchantId(idMerchant);
  }
}
