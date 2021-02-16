import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PutMerchantComponent } from './put-merchant.component';

describe('PutMerchantComponent', () => {
  let component: PutMerchantComponent;
  let fixture: ComponentFixture<PutMerchantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PutMerchantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PutMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
