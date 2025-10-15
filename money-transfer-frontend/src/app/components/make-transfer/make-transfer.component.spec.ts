import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeTransferComponent } from './make-transfer.component';

describe('MakeTransferComponent', () => {
  let component: MakeTransferComponent;
  let fixture: ComponentFixture<MakeTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakeTransferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakeTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
