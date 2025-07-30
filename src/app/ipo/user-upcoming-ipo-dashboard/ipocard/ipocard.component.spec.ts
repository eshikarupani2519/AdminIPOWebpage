import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpocardComponent } from './ipocard.component';

describe('IpocardComponent', () => {
  let component: IpocardComponent;
  let fixture: ComponentFixture<IpocardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IpocardComponent]
    });
    fixture = TestBed.createComponent(IpocardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
