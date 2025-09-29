import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentInfosComponent } from './payment-infos.component';

describe('PaymentInfosComponent', () => {
  let component: PaymentInfosComponent;
  let fixture: ComponentFixture<PaymentInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentInfosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
