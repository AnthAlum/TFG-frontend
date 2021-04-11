import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BackendMeetingsService } from '../backend-meetings.service';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { LoadingService } from '../loading.service';
import { Meeting } from '../meeting';
import { MeetingCreateComponent } from '../meeting-create/meeting-create.component';
import { MeetingDetailComponent } from '../meeting-detail/meeting-detail.component';
import { MeetingPage } from '../meeting-page';
import { SnackbarMessageComponent } from '../snackbar-message/snackbar-message.component';

@Component({
  selector: 'app-get-meetings',
  templateUrl: './get-meetings.component.html',
  styleUrls: ['./get-meetings.component.css']
})
export class GetMeetingsComponent implements OnInit {

  public dataSource = new MatTableDataSource<Meeting>();
  meetingsNumber: number = 0;
  paginationSize: number = 5;
  paginationIndex: number = 0;
  queryDone: boolean = false;
  ready: boolean = false;
  displayedColumns: string[] = [ 'matter', 'date', 'merchants', 'clients', 'delete'];
  @ViewChild(MatTable) table: MatTable<Meeting>;
  //Attributes for filtering:
  selectedField: string = "";
  reference: GetMeetingsComponent;
  constructor(
    private meetingsService: BackendMeetingsService,
    private router: Router,
    public dialog: MatDialog,
    public loadingService: LoadingService,
    private snackBar: SnackbarMessageComponent,
  ) {
    this.reference = this;
   }

  ngOnInit(): void {
    this.getMeetings();
  }

  getMeetings(): void{
    this.loadingService.show();
    this.meetingsService.getMeetings(this.paginationIndex, this.paginationSize).subscribe(
      meetings => this.updateValues(meetings, false),
      error => this.loadingService.hide()
    );
  }

  changePagination(event: PageEvent): void{
    this.loadingService.show();
    this.paginationIndex = event.pageIndex;
    this.paginationSize = event.pageSize;
    this.getMeetings();
  }

  updateValues(meetings: MeetingPage, isQuery?: boolean): void{
    this.meetingsNumber = meetings.paginationInfo.totalElements;
    this.dataSource.data = meetings.pages as Meeting[];
    this.ready = true;
    this.loadingService.hide();
    this.queryDone = isQuery!;
  }

  askForDeleteMeeting(idMeeting: number, meeting: Meeting): void{
    let action: string = "Delete";
    let order = ["matter", "date"]
    const dialogRef = this.dialog.open(DialogConfirmationComponent,{
      data: [ meeting, order, action],
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadingService.show();
      if(result.event === action)
        this.deleteMeeting(idMeeting, meeting);
      else
        this.loadingService.hide();
    });
  }

  deleteMeeting(idMeeting: number, meeting: Meeting): void{
    this.meetingsService.deleteMeeting(idMeeting).subscribe(_ => {
      this.getMeetings();
      this.loadingService.hide();
      this.snackBar.openSnackBar("Meeting successfully deleted!", "Okey")
    });
  }

  showData(rowIndex: number, meeting: Meeting): void{
    this.loadingService.show();
    this.meetingsService.getMeetingById(meeting.idMeeting).subscribe(
      meetingUpdated => {
        const dialogRef = this.dialog.open(MeetingDetailComponent, {
          data: meetingUpdated,
          height: '90%',
          width: '100%',
        });
        dialogRef.afterClosed().subscribe(
          _ => {
            this.loadingService.show();
            this.meetingsService.getMeetingById(meeting.idMeeting).subscribe(
              updatedMeeting => {
                meeting = updatedMeeting;
                this.dataSource.data[rowIndex] = updatedMeeting;
                this.table.renderRows();
                this.loadingService.hide();
        })});
        this.loadingService.hide();
      }
    );
  }

  addMeeting(): void{
    const dialogRef = this.dialog.open(MeetingCreateComponent, {
      height: '90%',
      width: '100%',
    });
    dialogRef.afterClosed().subscribe(_ => this.getMeetings()); //Update the meeting list
  }

  search(newValue): void {
    this.loadingService.show();
    switch(this.selectedField){
      case "matter":
        this.meetingsService.getMeetingsByMatter(newValue.target.value, this.paginationIndex, this.paginationSize).subscribe(
          meetings => this.updateValues(meetings),
          _ => this.loadingService.hide()
        );
        break;
      default:
        break;
    }
  }
}
