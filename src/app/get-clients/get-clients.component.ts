import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BackendService } from '../backend.service';
import { Router } from '@angular/router';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { LoadingService } from '../loading.service';
import { PageEvent } from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import { SnackbarMessageComponent } from '../snackbar-message/snackbar-message.component';
import { BackendClientsService } from '../backend-clients.service';
import { ClientPage } from '../client-page';
import { Client } from '../client';

@Component({
  selector: 'app-get-clients',
  templateUrl: './get-clients.component.html',
  styleUrls: ['./get-clients.component.css']
})
export class GetClientsComponent implements OnInit {

  public dataSource = new MatTableDataSource<Client>();
  @Input() clients: any = undefined;
  originalClientsNumber: number = 0;
  clientsNumber: number = 0;
  paginationSize: number = 5;
  paginationIndex: number = 0;
  displayedColumns: string[] = ['name', 'phone', 'email', 'company', 'modify', 'delete'];
  @ViewChild(MatTable) table?: MatTable<any>;
  //Attributes for filtering:
  selectedField: string = "";
  constructor(
    private clientsService: BackendClientsService,
    private router:Router,
    public dialog: MatDialog,
    public loadingService: LoadingService,
    private snackBar: SnackbarMessageComponent,
  ) { }


  ngOnInit(): void {
    this.getClients();
  }

  getClients(): void{
    this.clientsService.getClients(this.paginationIndex, this.paginationSize).subscribe(
      clients => this.updateValues(clients), 
      error => this.loadingService.hide()
    );
  }

  changePagination(event: PageEvent): void{
    this.loadingService.show();
    this.paginationIndex = event.pageIndex;
    this.paginationSize = event.pageSize;
    this.getClients();
  }

  askForDeleteClient(idClient: string, element: Client): void{
    let action: string = "Delete";
    let order = ["name", "email", "phone", "company"]
    const dialogRef = this.dialog.open(DialogConfirmationComponent,{
      data: [ this.modify(element), order, action]
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadingService.show();
      if(result.event === action)
        this.deleteMerchant(idClient, element);
      else
        this.loadingService.hide();
    });
  }


  deleteMerchant(idMerchant: string, element: any):void{
    this.clientsService.deleteClient(parseInt(idMerchant)).subscribe(_ => {
      this.deleteRow(element);
      this.loadingService.hide();
      this.snackBar.openSnackBar("Client successfully deleted!", "Okey")
    });
  }

  goToAddMerchant(): void{
    this.router.navigateByUrl("/clients-add");
    this.loadingService.show();
  }

  goToModifyClient(id: number): void{
    this.router.navigateByUrl(`/clients-modify/${id}`);
    this.loadingService.show();
  }

  deleteRow(row: any):void {
    this.clientsService.getClients(this.paginationIndex, this.paginationSize).subscribe(
      clients => this.updateValues(clients), 
      error => this.loadingService.hide()
    );
  }

  modify(element: any): {[key: string]: any}{
    let elementModified: {[key: string]: any} = {...element};
    delete elementModified['idClient'];
    return elementModified;
  }

  search(): void {
    let filterTerm: string = (<HTMLInputElement>document.getElementById("filter")).value;
    if(filterTerm.localeCompare("") === 0)
      this.getClients();
    else
      this.searchByField(this.selectedField, filterTerm);
  }
  
  searchByField(field: string, term: string): void{
    switch(field){
      /*case "name":
          this.clientsService.getClientsByName(term, this.paginationIndex, this.paginationSize).subscribe(
            merchants => this.updateValues(merchants),
            error => this.loadingService.hide()
          );
        break;
        case "phone":
          this.backendService.getClientsByPhone(term, this.paginationIndex, this.paginationSize).subscribe(
            merchants => this.updateValues(merchants),
            error => this.loadingService.hide()
          );
          break;
        case "email":
          this.backendService.getClientsByEmail(term, this.paginationIndex, this.paginationSize).subscribe(
            merchants => this.updateValues(merchants),
            error => this.loadingService.hide()
          );
        break;
      case "role":
        this.backendService.getClientsByIdRole(parseInt(term), this.paginationIndex, this.paginationSize).subscribe(
          merchants => this.updateValues(merchants),
          error => this.loadingService.hide()
        );
        break;*/
      default:
        break;
    }
  }

  updateValues(clients: ClientPage): void{
    this.clientsNumber = clients.paginationInfo.totalElements;
    this.originalClientsNumber = this.clientsNumber;
    this.dataSource.data = clients.pages as Client[];
    this.loadingService.hide();
  }
}
