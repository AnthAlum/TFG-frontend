import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BackendService } from '../backend.service';
import { Router } from '@angular/router';
import { MatTable } from '@angular/material/table';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-get-merchants',
  templateUrl: './get-merchants.component.html',
  styleUrls: ['./get-merchants.component.css']
})
export class GetMerchantsComponent implements OnInit {

  @Input() merchants: any = undefined;
  merchantsNumber: number = 0;
  paginationSize: number = 0;
  displayedColumns: string[] = [ 'idRole', 'nombre', 'email', 'telefono', 'modify', 'delete'];
  
  @ViewChild(MatTable) table?: MatTable<any>;

  constructor(
    private backendService: BackendService,
    private router:Router,
    public dialog: MatDialog,
    public loadingService: LoadingService,
  ) { }


  ngOnInit(): void {
    this.backendService.getMerchants().subscribe(
      merchants => {
        console.log(merchants);
        this.merchantsNumber = merchants.paginationInfo.totalElements;
        this.merchants = merchants.pages;
        this.loadingService.hide();
      }, error => {
        this.loadingService.hide();
        // TODO: Tratar el error
      }
    );
  }

  askForDeleteMerchant(idMerchant: string, element: any): void{
    let action: string = "Delete";
    let order = ["name", "email", "phone", "idRole"]
    const dialogRef = this.dialog.open(DialogConfirmationComponent,{
      data: [ this.modifyRole(element), order, action]
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadingService.show();
      if(result.event === action)
        this.deleteMerchant(idMerchant, element);
      else
        this.loadingService.hide();
    });
  }


  deleteMerchant(idMerchant: string, element: any):void{
    this.backendService.deleteMerchant(idMerchant).subscribe(_ => {
      this.deleteRow(element);
      this.loadingService.hide();
    });
  }

  goToAddMerchant(): void{
    this.router.navigateByUrl("/merchants-add");
    this.loadingService.show();
  }

  goToModifyMerchant(id: number): void{
    this.router.navigateByUrl(`/merchants-modify/${id}`);
    this.loadingService.show();
  }

  deleteRow(row: any):void {
    const index = this.merchants.indexOf(row, 0);
    if (index > -1) {
      this.merchants.splice(index, 1);
    }
    this.table?.renderRows();
  }

  modifyRole(element: any): {[key: string]: any}{
    let elementModified: {[key: string]: any} = {...element};
    if(elementModified.idRole === 0)
      elementModified.idRole = "Administrator";
    if(element.idRole === 1)
      elementModified.idRole = "Merchant";
    return elementModified;
  }

}
