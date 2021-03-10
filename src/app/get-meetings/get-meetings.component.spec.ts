import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetMeetingsComponent } from './get-meetings.component';

describe('GetMeetingsComponent', () => {
  let component: GetMeetingsComponent;
  let fixture: ComponentFixture<GetMeetingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetMeetingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetMeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
