import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingIpoScreenComponent } from './upcoming-ipo-screen.component';

describe('UpcomingIpoScreenComponent', () => {
  let component: UpcomingIpoScreenComponent;
  let fixture: ComponentFixture<UpcomingIpoScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpcomingIpoScreenComponent]
    });
    fixture = TestBed.createComponent(UpcomingIpoScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
