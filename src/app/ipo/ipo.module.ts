import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UpcomingIpoScreenComponent } from './upcoming-ipo-screen/upcoming-ipo-screen.component';
import { RegisterIpoDetailsComponent } from './register-ipo-details/register-ipo-details.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserUpcomingIpoDashboardComponent } from './user-upcoming-ipo-dashboard/user-upcoming-ipo-dashboard.component';
import { HeaderComponent } from './user-upcoming-ipo-dashboard/header/header.component';
import { FooterComponent } from './user-upcoming-ipo-dashboard/footer/footer.component';
import { FaqsComponent } from './user-upcoming-ipo-dashboard/faqs/faqs.component';
import { IpocardComponent } from './user-upcoming-ipo-dashboard/ipocard/ipocard.component';
import { PageBodyComponent } from './user-upcoming-ipo-dashboard/page-body/page-body.component';



@NgModule({
  declarations: [
    AdminDashboardComponent,
    UpcomingIpoScreenComponent,
    RegisterIpoDetailsComponent,
    UserUpcomingIpoDashboardComponent,
    HeaderComponent,
    FooterComponent,
    FaqsComponent,
    IpocardComponent,
    PageBodyComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class IPOModule { }
