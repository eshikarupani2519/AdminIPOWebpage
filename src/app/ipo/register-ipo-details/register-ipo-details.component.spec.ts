import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterIpoDetailsComponent } from './register-ipo-details.component';

describe('RegisterIpoDetailsComponent', () => {
  let component: RegisterIpoDetailsComponent;
  let fixture: ComponentFixture<RegisterIpoDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterIpoDetailsComponent]
    });
    fixture = TestBed.createComponent(RegisterIpoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
