import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BackendService } from '../backend.service';
import { Router } from '@angular/router';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { LoadingService } from '../loading.service';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Merchant } from '../merchant';

@Component({
  selector: 'app-get-merchants',
  templateUrl: './get-merchants.component.html',
  styleUrls: ['./get-merchants.component.css']
})
export class GetMerchantsComponent implements OnInit {

  public dataSource = new MatTableDataSource<Merchant>();
  @Input() merchants: any = undefined;
  originalMerchantsNumber: number = 0;
  merchantsNumber: number = 0;
  paginationSize: number = 5;
  paginationIndex: number = 0;
  displayedColumns: string[] = [ 'idRole', 'name', 'email', 'phone', 'modify', 'delete'];
  @ViewChild(MatTable) table?: MatTable<any>;
  
  constructor(
    private backendService: BackendService,
    private router:Router,
    public dialog: MatDialog,
    public loadingService: LoadingService,
    private formBuilder: FormBuilder,
  ) { }


  ngOnInit(): void {
    this.backendService.getMerchants(this.paginationIndex, this.paginationSize).subscribe(
      merchants => {
        this.merchantsNumber = merchants.paginationInfo.totalElements;
        this.originalMerchantsNumber = this.merchantsNumber;
        this.dataSource.data = merchants.pages as Merchant[];
        this.loadingService.hide();
      }, error => {
        this.loadingService.hide();
        // TODO: Tratar el error
      }
    );
  }

  changePagination(event: PageEvent): void{
    this.loadingService.show();
    this.paginationIndex = event.pageIndex;
    this.paginationSize = event.pageSize;
    this.backendService.getMerchants(event.pageIndex, event.pageSize).subscribe(
      merchants => {
        this.merchantsNumber = merchants.paginationInfo.totalElements;
        this.originalMerchantsNumber = this.merchantsNumber;
        this.dataSource.data = merchants.pages as Merchant[];
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
    const index = this.dataSource.data.indexOf(row, 0);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
    }
    this.table?.renderRows();
    this.backendService.getMerchants(this.paginationIndex, this.paginationSize).subscribe(
      merchants => {
        this.merchantsNumber = merchants.paginationInfo.totalElements;
        this.originalMerchantsNumber = this.merchantsNumber;
        this.dataSource.data = merchants.pages as Merchant[];
        this.loadingService.hide();
      }, error => {
        this.loadingService.hide();
        // TODO: Tratar el error
      }
    );
  }

  modifyRole(element: any): {[key: string]: any}{
    let elementModified: {[key: string]: any} = {...element};
    if(elementModified.idRole === 0)
      elementModified.idRole = "Administrator";
    if(element.idRole === 1)
      elementModified.idRole = "Merchant";
    return elementModified;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
    if(value.localeCompare('') != 0)
      this.merchantsNumber = this.dataSource.filteredData.length;
    else
      this.merchantsNumber = this.originalMerchantsNumber;
  }
}
