// import { Component, EventEmitter, Output } from '@angular/core';
// import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { DatabaseService } from 'src/app/database.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  currentUserName=''
  inValidCredentials: any = false;
 errorMessage:string=''
  constructor(private router: Router,private http:HttpClient) { }

  loginForm = new FormGroup({
    password: new FormControl('',[Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required])
  })
showPassword(passwordField: HTMLInputElement, icon: HTMLElement){
   const isPassword = passwordField.type === 'password';
  passwordField.type = isPassword ? 'text' : 'password';
  icon.classList.toggle('fa-eye');
  icon.classList.toggle('fa-eye-slash');
  }
  getFormControl(name: string) {
    return this.loginForm.get(name)
  }
  isFormControlError(name: string) {
    return this.loginForm.get(name)?.invalid && this.loginForm.get(name)?.dirty
  }
  isEmailValid(email: string) {
    return this.loginForm.get(email)?.invalid && this.loginForm.get(email)?.touched
  }
  isEmailRequired(name: string) {
    return this.loginForm.get(name)?.touched && this.loginForm.get(name)?.errors?.['required']
  }
  submitForm() {
    console.log(this.loginForm.value)
    
    this.validateLogin()
  }
validateLogin() {
      if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter valid credentials.';
      return;
    }

    const { email, password } = this.loginForm.value;

    this.http.post(`${environment.apiUrl}/auth/login`, { email, password }, {headers: { 'Content-Type': 'application/json' }})
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
           localStorage.setItem('IPOLoggedInUser', JSON.stringify(res.user.name));
          this.router.navigate(['/admin-dashboard']); 
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Login failed';
        }
      });
    }
  
  goToForgotPWPage(){
    this.router.navigate(['forgot-pw'])
  }
  goToSignUpPage(){
    this.router.navigate(['sign-up'])
  }

}




