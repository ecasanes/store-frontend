import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSellerModalComponent } from './add-seller-modal.component';

describe('AddSellerModalComponent', () => {
  let component: AddSellerModalComponent;
  let fixture: ComponentFixture<AddSellerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSellerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSellerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
