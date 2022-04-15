import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/common/auth/auth.service';
import { RegisterRequest } from 'src/app/interfaces/users';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit{

  registerForm: FormGroup;
  returnUrl: string;
  passwordVisible = false;
  passwordVisible2 = false;
  password?: string;
  submitted = false;
  loading = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) { 

    //redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required, Validators.minLength(8)],
      checkPassword: ['', [Validators.required, this.confirmationValidator]],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  register() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    const dto: RegisterRequest = {
      firstName: this.f.firstName.value,
      lastName: this.f.lastName.value,
      email: this.f.email.value,
      password: this.f.password.value
    };
    this.authService.register(dto)
      .pipe(first())
      .subscribe(user => {
        this.router.navigate([this.returnUrl]);
      }, error => {
        this.loading = false;
      });
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.registerForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.registerForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

}
