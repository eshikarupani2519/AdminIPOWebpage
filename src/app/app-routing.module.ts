import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ForgotPwComponent } from './auth/forgot-pw/forgot-pw.component';
import { AdminDashboardComponent } from './ipo/admin-dashboard/admin-dashboard.component';
import { UpcomingIpoScreenComponent } from './ipo/upcoming-ipo-screen/upcoming-ipo-screen.component';
import { RegisterIpoDetailsComponent } from './ipo/register-ipo-details/register-ipo-details.component';
import { UserUpcomingIpoDashboardComponent } from './ipo/user-upcoming-ipo-dashboard/user-upcoming-ipo-dashboard.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
  {path:'',component:UserUpcomingIpoDashboardComponent},
  {path:'sign-in',component:SignInComponent},
  {path:'sign-up',component:SignUpComponent},
  {path:'forgot-pw',component:ForgotPwComponent},
  {path:'admin-dashboard',component:AdminDashboardComponent,canActivate: [authGuard]},
  {path:'upcoming-IPO',component:UpcomingIpoScreenComponent},
  {path:'register-ipo-details',component:RegisterIpoDetailsComponent},
  {path:'register-ipo-details/:id',component:RegisterIpoDetailsComponent},
  {path:'user-upcoming-ipo-dashboard',component:UserUpcomingIpoDashboardComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
