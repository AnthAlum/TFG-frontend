import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PutMeetingComponent } from './put-meeting.component';

describe('PutMeetingComponent', () => {
  let component: PutMeetingComponent;
  let fixture: ComponentFixture<PutMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PutMeetingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PutMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
