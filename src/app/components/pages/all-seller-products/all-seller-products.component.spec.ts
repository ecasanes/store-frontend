import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSellerProductsComponent } from './all-seller-products.component';

describe('AllSellerProductsComponent', () => {
  let component: AllSellerProductsComponent;
  let fixture: ComponentFixture<AllSellerProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllSellerProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllSellerProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
