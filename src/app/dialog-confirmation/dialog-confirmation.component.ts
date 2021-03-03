import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-dialog-confirmation',
  templateUrl: './dialog-confirmation.component.html',
  styleUrls: ['./dialog-confirmation.component.css']
})
export class DialogConfirmationComponent implements OnInit {
  event: string = "";
  lastField: number = 0;

  information: { [key: string]: string} = {};
  fields: string[] = [];
  action: string = "";

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmationComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private loadingService: LoadingService
  ) {
  }
  
  ngOnInit(): void {
    this.dialogRef.disableClose = true;
    this.event = "Cancel";
    this.information = this.data[0];
    this.fields = this.data[1];
    this.action = this.data[2];
  }

  acceptAction(){
    this.dialogRef.close({
      event: this.action
    });
  }

  cancel(): void{
    this.dialogRef.close({
      event: "Cancel"
    });
    this.loadingService.hide();
  }
}
