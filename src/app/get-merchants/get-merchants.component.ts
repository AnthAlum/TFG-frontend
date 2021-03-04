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
  //Attributes for filtering:
  selectedField: string = "";
  constructor(
    private backendService: BackendService,
    private router:Router,
    public dialog: MatDialog,
    public loadingService: LoadingService,
    private formBuilder: FormBuilder,
  ) { }


  ngOnInit(): void {
    this.getMerchants();
  }

  getMerchants(): void{
    this.backendService.getMerchants(this.paginationIndex, this.paginationSize).subscribe(
      merchants => this.updateValues(merchants), 
      error => this.loadingService.hide()
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
    /*const index = this.dataSource.data.indexOf(row, 0);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
    }
    this.table!.renderRows();*/
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
    let filterTerm: string = (<HTMLInputElement>document.getElementById("filter")).value;
    if(filterTerm.localeCompare("") === 0)
      this.getMerchants();
    else
      this.searchByField(this.selectedField, filterTerm);
  }
  
  searchByField(field: string, term: string): void{
    switch(field){
      case "name":
          this.backendService.getMerchantsByName(term, this.paginationIndex, this.paginationSize).subscribe(
            merchants => this.updateValues(merchants),
            error => this.loadingService.hide()
          );
        break;
        case "phone":
          this.backendService.getMerchantsByPhone(term, this.paginationIndex, this.paginationSize).subscribe(
            merchants => this.updateValues(merchants),
            error => this.loadingService.hide()
          );
          break;
        case "email":
          this.backendService.getMerchantsByEmail(term, this.paginationIndex, this.paginationSize).subscribe(
            merchants => this.updateValues(merchants),
            error => this.loadingService.hide()
          );
        break;
      case "role":
        this.backendService.getMerchantsByIdRole(parseInt(term), this.paginationIndex, this.paginationSize).subscribe(
          merchants => this.updateValues(merchants),
          error => this.loadingService.hide()
        );
        break;
      default:
        break;
    }
  }

  updateValues(merchants: MerchantPage): void{
    this.merchantsNumber = merchants.paginationInfo.totalElements;
    this.originalMerchantsNumber = this.merchantsNumber;
    this.dataSource.data = merchants.pages as Merchant[];
    this.loadingService.hide();
  }
}
