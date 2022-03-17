import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  authForm: FormGroup;

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  onSubmit() {
    console.log(this.authForm.value);
    if (!this.authForm.valid) {
      return;
    }
    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      (resData) => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    this.authForm.reset();
  }
}
// export class AuthComponent {
//   isLoginMode = true;
//   isLoading = false;
//   error: string = null;

//   constructor(private authService: AuthService, private router: Router) {}
//   onSwitchMode() {
//     this.isLoginMode = !this.isLoginMode;
//   }
//   onSubmit(form: NgForm) {
//     console.log(form.value);
//     if (!form.valid) {
//       return;
//     }
//     const email = form.value.email;
//     const password = form.value.password;

//     let authObs: Observable<AuthResponseData>;

//     this.isLoading = true;
//     if (this.isLoginMode) {
//       authObs = this.authService.login(email, password);
//     } else {
//       authObs = this.authService.signup(email, password);
//     }

//     authObs.subscribe(
//       (resData) => {
//         console.log(resData);
//         this.isLoading = false;
//         this.router.navigate(['/recipes']);
//       },
//       (errorMessage) => {
//         console.log(errorMessage);
//         this.error = errorMessage;
//         this.isLoading = false;
//       }
//     );

//     form.reset();
//   }
// }
