import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVoucherModalComponent } from './edit-voucher-modal.component';

describe('EditVoucherModalComponent', () => {
  let component: EditVoucherModalComponent;
  let fixture: ComponentFixture<EditVoucherModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVoucherModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVoucherModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
