import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/database.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
 
  constructor(private router: Router,private database:DatabaseService,private http:HttpClient) { }

  registerFormGroup= new FormGroup({
    name: new FormControl('', [Validators.required]),
    password: new FormControl(''),
    email: new FormControl('', [Validators.email, Validators.required])
  })
  showPassword(passwordField: HTMLInputElement, icon: HTMLElement){
   const isPassword = passwordField.type === 'password';
  passwordField.type = isPassword ? 'text' : 'password';
  icon.classList.toggle('fa-eye');
  icon.classList.toggle('fa-eye-slash');
  }
  getFormControl(name: string) {
    return this.registerFormGroup.get(name)
  }
  isFormControlError(name: string) {
    return this.registerFormGroup.get(name)?.invalid && this.registerFormGroup.get(name)?.dirty
  }
  isEmailValid(email: string) {
    return this.registerFormGroup.get(email)?.invalid && this.registerFormGroup.get(email)?.touched
  }
  isEmailRequired(name: string) {
    return this.registerFormGroup.get(name)?.touched && this.registerFormGroup.get(name)?.errors?.['required']
  }
//  submitData(){
//     console.log(this.registerFormGroup.value)
//     let value=this.registerFormGroup.value;
//     let name=value.name;
//     let email=value.email;
//     let password=value.password;


//     this.http.post(`${environment.apiUrl}/auth/signup`, { name, email, password })

//     this.registerFormGroup.reset()
//   }
submitData() {
  if (this.registerFormGroup.invalid) return;

  const { name, email, password } = this.registerFormGroup.value;

  this.http.post(`${environment.apiUrl}/auth/signup`, { name, email, password })
    .subscribe({
      next: (res: any) => {
        alert('User registered successfully');
        this.goToSignInPage();
      },
      error: (err) => {
        alert(err.error.message || 'Registration failed');
      }
    });
}
  goToSignInPage(){
    this.router.navigate(['sign-in']);
  }
  
}
