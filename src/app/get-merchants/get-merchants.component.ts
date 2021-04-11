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
import {MatSelectModule} from '@angular/material/select';
import { MerchantPage } from '../merchant-page';
import { SnackbarMessageComponent } from '../snackbar-message/snackbar-message.component';

@Component({
  selector: 'app-get-merchants',
  templateUrl: './get-merchants.component.html',
  styleUrls: ['./get-merchants.component.css'],
})
export class GetMerchantsComponent implements OnInit {

  public dataSource = new MatTableDataSource<Merchant>();
  originalMerchantsNumber: number = 0;
  merchantsNumber: number = 0;
  paginationSize: number = 5;
  paginationIndex: number = 0;
  queryDone: boolean = false;
  displayedColumns: string[] = [ 'idRole', 'name', 'email', 'phone', 'modify', 'delete'];
  @ViewChild(MatTable) table?: MatTable<any>;
  //Attributes for filtering:
  selectedField: string = "";
  reference: GetMerchantsComponent;
  constructor(
    private backendService: BackendService,
    private router:Router,
    public dialog: MatDialog,
    public loadingService: LoadingService,
    private snackBar: SnackbarMessageComponent,
  ) {
    this.reference = this;
  }


  ngOnInit(): void {
    this.getMerchants();
  }

  getMerchants(): void{
    this.backendService.getMerchants(this.paginationIndex, this.paginationSize).subscribe(
      merchants => this.updateValues(merchants, false),
      _ => this.loadingService.hide()
    );
  }

  changePagination(event: PageEvent): void{
    this.loadingService.show();
    this.paginationIndex = event.pageIndex;
    this.paginationSize = event.pageSize;
    this.getMerchants();
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
      this.snackBar.openSnackBar("Merchant successfully deleted!", "Okey")
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
    this.backendService.getMerchants(this.paginationIndex, this.paginationSize).subscribe(
      merchants => this.updateValues(merchants),
      error => this.loadingService.hide()
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

  search(): void {
    let filterTerm: string = this.filterInput("get");
    if(filterTerm.localeCompare('')!==0)
      this.searchByField(this.selectedField, filterTerm);
  }

  searchByField(field: string, term: string): void{
    this.loadingService.show();
    switch(field){
      case "name":
        this.backendService.getMerchantsByName(term, this.paginationIndex, this.paginationSize).subscribe(
            merchants => this.updateValues(merchants, true),
            error => this.loadingService.hide()
          );
        break;
      case "phone":
        this.backendService.getMerchantsByPhone(term, this.paginationIndex, this.paginationSize).subscribe(
            merchants => this.updateValues(merchants, true),
            error => this.loadingService.hide()
          );
        break;
      case "email":
        this.backendService.getMerchantsByEmail(term, this.paginationIndex, this.paginationSize).subscribe(
            merchants => this.updateValues(merchants, true),
            error => this.loadingService.hide()
          );
        break;
      case "role":
        this.backendService.getMerchantsByIdRole(parseInt(term), this.paginationIndex, this.paginationSize).subscribe(
          merchants => this.updateValues(merchants, true),
          error => this.loadingService.hide()
        );
        break;
      default:
        break;
    }
  }

  updateValues(merchants: MerchantPage, query?: boolean): void{
    this.merchantsNumber = merchants.paginationInfo.totalElements;
    this.originalMerchantsNumber = this.merchantsNumber;
    this.dataSource.data = merchants.pages as Merchant[];
    this.loadingService.hide();
    this.queryDone = query!;
  }

  cancelFiltering(): void{
    this.loadingService.show();
    this.getMerchants();
    this.filterInput("reset");
  }

  filterInput(action: string): string{
    switch(action){
      case "get":
        return (<HTMLInputElement>document.getElementById("filter")).value;
      case "reset":
        (<HTMLInputElement>document.getElementById("filter")).value = "";
      break;
    }
    return "";
  }
}
