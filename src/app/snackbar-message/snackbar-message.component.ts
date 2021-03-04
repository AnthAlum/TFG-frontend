import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar-message',
  templateUrl: './snackbar-message.component.html',
  styleUrls: ['./snackbar-message.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SnackbarMessageComponent implements OnInit {

  constructor(
    private snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
  }

  openSnackBar(message: string, action: string) {
    let config = new MatSnackBarConfig();
    config.duration = 10000;
    config.panelClass = ['red-snackbar'];
    this.snackBar.open(message, action, config);
  }
}
