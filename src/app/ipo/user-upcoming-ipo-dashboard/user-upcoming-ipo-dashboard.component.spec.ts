import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUpcomingIpoDashboardComponent } from './user-upcoming-ipo-dashboard.component';

describe('UserUpcomingIpoDashboardComponent', () => {
  let component: UserUpcomingIpoDashboardComponent;
  let fixture: ComponentFixture<UserUpcomingIpoDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserUpcomingIpoDashboardComponent]
    });
    fixture = TestBed.createComponent(UserUpcomingIpoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
