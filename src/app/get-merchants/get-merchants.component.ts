import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BackendService } from '../backend.service';
import { Router } from '@angular/router';
import { MatTable } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';

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
    private router:Router,
    public dialog: MatDialog,
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

  askForDeleteMerchant(idMerchant: string, element: any): void{
    let modifiedInformation: { [key: string]: string} = this.modifyInformation(element);
    let action: string = "Delete";
    modifiedInformation.z = action;
    const dialogRef = this.dialog.open(DialogConfirmationComponent,{
      data: modifiedInformation
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event === "Delete")
        this.deleteMerchant(idMerchant, element);
    });
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

  modifyInformation(element: any): any{
    let role = "User";
    if(element.idRole === 0)
      role = "Admin";
    let modified = {
      a: element.name,
      b: element.email,
      c: element.phone,
      d: role
    };
    return modified;
  }
}
