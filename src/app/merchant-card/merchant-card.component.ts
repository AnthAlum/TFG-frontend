import { Component, OnInit, Input } from '@angular/core';
import { GetMerchantsComponent } from '../get-merchants/get-merchants.component';
import { Merchant } from '../merchant';

@Component({
  selector: 'app-merchant-card',
  templateUrl: './merchant-card.component.html',
  styleUrls: ['./merchant-card.component.css']
})
export class MerchantCardComponent implements OnInit {

  @Input() merchant: Merchant;
  @Input() reference: GetMerchantsComponent;
  constructor() { }

  ngOnInit(): void {
  }

  goToModifyMerchant(): void{
    this.reference.goToModifyMerchant(this.merchant.idMerchant);
  }

  askForDeleteMerchant(): void{
    this.reference.deleteMerchant(this.merchant.idMerchant.toString(), this.merchant);
  }
}
