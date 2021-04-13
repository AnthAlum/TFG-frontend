import { Component, Input, OnInit } from '@angular/core';
import { GetMeetingsComponent } from '../get-meetings/get-meetings.component';
import { Meeting } from '../meeting';

@Component({
  selector: 'app-meeting-card',
  templateUrl: './meeting-card.component.html',
  styleUrls: ['./meeting-card.component.css']
})
export class MeetingCardComponent implements OnInit {

  @Input() meeting: Meeting;
  @Input() index: number;
  @Input() reference: GetMeetingsComponent;
  constructor() {
    //Comment
  }

  ngOnInit(): void {
    //Comment
  }

  showMeetingDetail(): void{
    this.reference.showData(this.index, this.meeting);
  }

  askForDeleteMeeting(): void{
    this.reference.askForDeleteMeeting(this.meeting.idMeeting, this.meeting);
  }
}
