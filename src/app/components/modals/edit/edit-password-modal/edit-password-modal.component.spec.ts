import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPasswordModalComponent } from './edit-password-modal.component';

describe('EditPasswordModalComponent', () => {
  let component: EditPasswordModalComponent;
  let fixture: ComponentFixture<EditPasswordModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPasswordModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
