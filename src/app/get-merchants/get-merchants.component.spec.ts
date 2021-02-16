import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetMerchantsComponent } from './get-merchants.component';

describe('GetMerchantsComponent', () => {
  let component: GetMerchantsComponent;
  let fixture: ComponentFixture<GetMerchantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetMerchantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetMerchantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
