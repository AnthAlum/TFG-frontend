import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoadingService } from '../loading.service';
import { Meeting } from '../meeting';

@Component({
  selector: 'app-meeting-detail',
  templateUrl: './meeting-detail.component.html',
  styleUrls: ['./meeting-detail.component.css']
})
export class MeetingDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MeetingDetailComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Meeting,
    private loadingService: LoadingService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
  }

  close(): void{
    this.dialogRef.close();
  }

  goToModifyMeeting(meeting: Meeting): void{
    this.close();
    this.router.navigateByUrl(`/meetings-modify/${meeting.idMeeting}`);
    this.loadingService.show();
  }
}
