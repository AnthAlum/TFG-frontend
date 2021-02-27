import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BackendService } from '../backend.service';
import { Router } from '@angular/router';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-get-merchants',
  templateUrl: './get-merchants.component.html',
  styleUrls: ['./get-merchants.component.css']
})
export class GetMerchantsComponent implements OnInit {

  @Input() merchants: any = undefined;
  displayedColumns: string[] = ['id', 'idRole', 'nombre', 'email', 'telefono', 'modify', 'delete'];
  
  @ViewChild(MatTable) table?: MatTable<any>;

  constructor(
    private backendService: BackendService,
    private router:Router
  ) { }


  ngOnInit(): void {
    this.backendService.getMerchants().subscribe(
      merchants => {
        this.merchants = merchants.pages;
      }, error => {
        // TODO: Tratar el error
      }
    );
  }

  deleteMerchant(idMerchant: string, element: any):void{
    this.backendService.deleteMerchant(idMerchant).subscribe(_ => this.deleteRow(element));
  }

  goToAddMerchant(): void{
    this.router.navigateByUrl("/merchants-add");
  }

  deleteRow(row: any):void {
    const index = this.merchants.indexOf(row, 0);
    if (index > -1) {
      this.merchants.splice(index, 1);
    }
    this.table?.renderRows();
  }
}
