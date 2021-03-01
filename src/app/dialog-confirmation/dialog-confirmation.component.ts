import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirmation',
  templateUrl: './dialog-confirmation.component.html',
  styleUrls: ['./dialog-confirmation.component.css']
})
export class DialogConfirmationComponent implements OnInit {
  action: String = new String();
  event:string = "";
  attributes: string[] = [];
  last: number = 0;
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmationComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() @Inject(MAT_DIALOG_DATA) public fields: string[]
  ) {
  }
  
  ngOnInit(): void {
    this.event = "Cancel";
    this.attributes = Object.keys(this.data); //Get attributes, the last one is the action
    this.last = this.attributes.length - 1; //Extract the action
    this.action = { ...this.data }[this.attributes[this.last]];
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
  }
}
