import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostMerchantComponent } from './post-merchant.component';

describe('PostMerchantComponent', () => {
  let component: PostMerchantComponent;
  let fixture: ComponentFixture<PostMerchantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostMerchantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
