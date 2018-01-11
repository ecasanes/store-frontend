import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBuyerModalComponent } from './add-buyer-modal.component';

describe('AddBuyerModalComponent', () => {
  let component: AddBuyerModalComponent;
  let fixture: ComponentFixture<AddBuyerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBuyerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBuyerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
