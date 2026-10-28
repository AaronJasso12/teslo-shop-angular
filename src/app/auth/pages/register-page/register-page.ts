import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth-service';
import { AlertError } from '@auth/components/alert-error/alert-error';
import { FormUtils } from '@utils/form-utils';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, AlertError, RouterLink],
  templateUrl: './register-page.html',
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private authSrv = inject(AuthService);
  private router = inject(Router);
  formUtils = FormUtils;

  hasError = signal(false);
  isPosting = signal(false);
  showPassword = signal(false);
  showPasswordConfirmation = signal(false);

  registerForm = this.fb.group({
    email: ['', [
      Validators.required,
      Validators.pattern(this.formUtils.emailPattern)
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(50),
      Validators.pattern(this.formUtils.passwordPattern)
    ]],
    passwordConfirmation: ['', [
      Validators.required
    ]],
    fullName: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(this.formUtils.namePattern)
    ]]
  },{
    validators: [this.formUtils.isFieldOneEqualFieldTwo('password', 'passwordConfirmation')],
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    const { email = '', password = '', fullName = ''} = this.registerForm.value;

    this.authSrv.register(email!, password!, fullName!)
    .subscribe(isAuthenticate => {
      if (isAuthenticate) {
        this.router.navigateByUrl('/');
        return;
      }

      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
    });
  }

  togglePasswordVisibility(passwordField: 'password' | 'passwordConfirmation') {
    if (passwordField === 'password') {
      this.showPassword.update(value => !value);
    } else {
      this.showPasswordConfirmation.update(value => !value);
    }
  }
}
