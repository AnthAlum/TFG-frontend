import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostClientComponent } from './post-client.component';

describe('PostClientComponent', () => {
  let component: PostClientComponent;
  let fixture: ComponentFixture<PostClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
