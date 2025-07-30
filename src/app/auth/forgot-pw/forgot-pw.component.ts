import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-pw',
  templateUrl: './forgot-pw.component.html',
  styleUrls: ['./forgot-pw.component.css']
})
export class ForgotPwComponent {
  constructor(private router:Router){}
forgotPWForm=new FormGroup(
  {
    email:new FormControl('',[Validators.required,Validators.email])
  }
)
 isEmailValid(email: string) {
    return this.forgotPWForm.get(email)?.invalid && this.forgotPWForm.get(email)?.touched
  }
  isEmailRequired(name: string) {
    return this.forgotPWForm.get(name)?.touched && this.forgotPWForm.get(name)?.errors?.['required']
  }
submitForm(){
console.log(this.forgotPWForm.value)
}
goToLoginPage(){
this.router.navigate(['sign-in'])
}
}
