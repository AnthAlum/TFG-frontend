import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PutClientComponent } from './put-client.component';

describe('PutClientComponent', () => {
  let component: PutClientComponent;
  let fixture: ComponentFixture<PutClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PutClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PutClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
