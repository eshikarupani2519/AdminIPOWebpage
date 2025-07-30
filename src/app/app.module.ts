import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { IPOModule } from './ipo/ipo.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from '../../backend/interceptors/token.interceptor';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    IPOModule,
    FormsModule,
    ReactiveFormsModule,
    // be
    HttpClientModule
     // be
  ],
  //bes
  providers: [
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
],
//bee
  bootstrap: [AppComponent]
})
export class AppModule { 


}
