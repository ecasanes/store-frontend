import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVoucherModalComponent } from './add-voucher-modal.component';

describe('AddVoucherModalComponent', () => {
  let component: AddVoucherModalComponent;
  let fixture: ComponentFixture<AddVoucherModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVoucherModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVoucherModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
