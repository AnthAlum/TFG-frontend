import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BackendMeetingsService } from '../backend-meetings.service';
import { LoadingService } from '../loading.service';
import { Meeting } from '../meeting';
import { MeetingPage } from '../meeting-page';
import { SnackbarMessageComponent } from '../snackbar-message/snackbar-message.component';

@Component({
  selector: 'app-get-meetings',
  templateUrl: './get-meetings.component.html',
  styleUrls: ['./get-meetings.component.css']
})
export class GetMeetingsComponent implements OnInit {

  public dataSource = new MatTableDataSource<Meeting>();
  originalMeetingsNumber: number = 0;
  meetingsNumber: number = 0;
  paginationSize: number = 5;
  paginationIndex: number = 0;
  queryDone: boolean = false;
  ready: boolean = false;
  displayedColumns: string[] = [ 'matter', 'date', 'idsMerchant', 'idsClient', 'modify', 'delete'];
  @ViewChild(MatTable) table?: MatTable<any>;
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
    this.originalMeetingsNumber = this.meetingsNumber;
    this.dataSource.data = meetings.pages as Meeting[];
    this.ready = true;
    this.loadingService.hide();
    this.queryDone = isQuery!;
  }
}
