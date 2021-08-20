import { Component, OnInit, ViewChild } from '@angular/core';
import { BackendService } from '../backend.service';
import { Router } from '@angular/router';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { LoadingService } from '../loading.service';
import { PageEvent } from '@angular/material/paginator';
import { Merchant } from '../merchant';
import { MerchantPage } from '../merchant-page';
import { SnackbarMessageComponent } from '../snackbar-message/snackbar-message.component';
import { MeetingListResponse } from '../meeting-list-response';
import { MeetingSimplifiedListResponse } from '../meeting-simplified-list-response';

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
  displayedColumns: string[] = [ 'idRole', 'name', 'email', 'phone', 'modify', 'delete'];
  @ViewChild(MatTable) table: MatTable<Merchant>;
  //Attributes for filtering:
  selectedField: string = "name";
  reference: GetMerchantsComponent; // This is used for merchant-card component.
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
    this.loadingService.show();
    this.backendService.getMerchants(this.paginationIndex, this.paginationSize).subscribe(
      merchants => this.updateValues(merchants),
      _ => this.loadingService.hide()
    );
  }

  changePagination(event: PageEvent): void{
    this.loadingService.show();
    this.paginationIndex = event.pageIndex;
    this.paginationSize = event.pageSize;
    this.getMerchants();
  }

  askForDeleteMerchant(idMerchant: string, element: Merchant): void{
    let action: string = "Delete";
    let order = ["name", "email", "phone", "Role"]
    const dialogRef = this.dialog.open(DialogConfirmationComponent,{
      data: [ this.modifyRole(element), order, action]
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadingService.show();
      if(result.event === action)
        this.deleteMerchant(idMerchant);
      else
        this.loadingService.hide();
    });
  }


  deleteMerchant(idMerchant: string):void{
    this.backendService.deleteMerchant(idMerchant).subscribe(_ => {
      this.getMerchants();
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

  modifyRole(element: Merchant): {[key: string]: string | number | MeetingSimplifiedListResponse}{
    let elementModified: {[key: string]: string | number | MeetingSimplifiedListResponse} = {...element};
    if(elementModified.idRole === 0)
      elementModified.Role = "Administrator";
    if(element.idRole === 1)
      elementModified.Role = "Merchant";
    return elementModified;
  }

  searchByField(filterTerm: string): void {
    this.loadingService.show();
    switch(this.selectedField){
      case "name":
        this.backendService.getMerchantsByName(filterTerm, this.paginationIndex, this.paginationSize).subscribe(
            merchants => this.updateValues(merchants),
            _ => this.loadingService.hide());
        break;
      case "phone":
        this.backendService.getMerchantsByPhone(filterTerm, this.paginationIndex, this.paginationSize).subscribe(
            merchants => this.updateValues(merchants),
            _ => this.loadingService.hide());
        break;
      case "email":
        this.backendService.getMerchantsByEmail(filterTerm, this.paginationIndex, this.paginationSize).subscribe(
            merchants => this.updateValues(merchants),
            _ => this.loadingService.hide());
        break;
      case "role":
        this.backendService.getMerchantsByIdRole(parseInt(filterTerm), this.paginationIndex, this.paginationSize).subscribe(
          merchants => this.updateValues(merchants),
          _ => this.loadingService.hide());
        break;
    }
  }

  updateValues(merchants: MerchantPage): void{
    this.merchantsNumber = merchants.paginationInfo.totalElements;
    this.originalMerchantsNumber = this.merchantsNumber;
    this.dataSource.data = merchants.pages;
    this.loadingService.hide();
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

  formatRole(idRole: number): string{
    if(idRole === 0)
      return "ADMIN";
    return "MERCHANT";
  }
}
