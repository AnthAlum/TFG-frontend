import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { LoadingService } from '../loading.service';
import { PageEvent } from '@angular/material/paginator';
import { SnackbarMessageComponent } from '../snackbar-message/snackbar-message.component';
import { BackendClientsService } from '../backend-clients.service';
import { ClientPage } from '../client-page';
import { Client } from '../client';
import { MeetingSimplifiedListResponse } from '../meeting-simplified-list-response';

@Component({
  selector: 'app-get-clients',
  templateUrl: './get-clients.component.html',
  styleUrls: ['./get-clients.component.css']
})
export class GetClientsComponent implements OnInit {

  public dataSource = new MatTableDataSource<Client>();
  originalClientsNumber: number = 0;
  clientsNumber: number = 0;
  paginationSize: number = 5;
  paginationIndex: number = 0;
  displayedColumns: string[] = ['name', 'phone', 'email', 'company', 'modify', 'delete'];
  @ViewChild(MatTable) table?: MatTable<Client>;
  reference: GetClientsComponent;
  //Attributes for filtering:
  selectedField: string = "name";
  constructor(
    private clientsService: BackendClientsService,
    private router:Router,
    public dialog: MatDialog,
    public loadingService: LoadingService,
    private snackBar: SnackbarMessageComponent,
  ) {
    this.reference = this;
  }


  ngOnInit(): void {
    this.getClients();
  }

  getClients(): void{
    this.clientsService.getClients(this.paginationIndex, this.paginationSize).subscribe(
      clients => this.updateValues(clients),
      _ => this.loadingService.hide()
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
        this.deleteClient(idClient);
      else
        this.loadingService.hide();
    });
  }


  deleteClient(idClient: string):void{
    this.clientsService.deleteClient(parseInt(idClient)).subscribe(_ => {
      this.getClients();
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


  modify(element: Client ): {[key: string]: string | number | MeetingSimplifiedListResponse}{
    let elementModified: {[key: string]: string | number | MeetingSimplifiedListResponse} = {...element};
    delete elementModified['idClient'];
    return elementModified;
  }


  searchByField(term: string): void{
    this.loadingService.show();
    this.clientsService.getClientsByAttribute(this.selectedField, term, this.paginationIndex, this.paginationSize).subscribe(
      clients => this.updateValues(clients),
      _ => this.loadingService.hide()
    );
  }

  updateValues(clients: ClientPage): void{
    this.clientsNumber = clients.paginationInfo.totalElements;
    this.dataSource.data = clients.pages;
    this.loadingService.hide();
  }

  cancelFiltering(): void{
    this.loadingService.show();
    this.getClients();
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
