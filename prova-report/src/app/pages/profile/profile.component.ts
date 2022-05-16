import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ProjectService } from 'src/app/services/projects.service';
import { ProfilesService } from '../../services/profiles.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common/auth/auth.service';
import { User } from 'src/app/interfaces/users';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  passwordVisible = false;
  passwordVisible1 = false;
  passwordVisible2 = false;
  isCollapsed = false;
  currentUser: User;
  data: Array<{
    id: number;
    title: string;
    project: string;
    description: string;
    registerDate: string;
    registerBy: string;
  }> = [];
  projects: Array<{
    label: string;
    value: number;
  }> = [];
  isVisible = false;
  isOkLoading = false;
  validateForm!: FormGroup;
  id: number;
  sProject: number = 0;
  page: number = 1;
  pageSize: number = 10;
  count: number = this.pageSize;

  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription = new Subscription();
  debounceTime = 500;

  constructor(
    private profileService: ProfilesService,
    private projectService: ProjectService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.subscription.add(this.authService.currentUser.subscribe(u => {
      this.currentUser = u;
    }));
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      newPasswordR: [null, [Validators.required]]
    });


  }
  submitForm(): void {
    if (this.validateForm.valid) {
      if (this.id) {
        this.profileService
          .resetPassword(
            this.validateForm.controls['oldPassword'].value,
            this.validateForm.controls['newPassword'].value
          )
          .subscribe(
            (suite) => {
              console.log('Response: ', suite);
              this.validateForm.controls['oldPassword'].setValue('');
              this.validateForm.controls['newPassword'].setValue('');
            },
            (error) => console.log(error)
          );
      } else {
        this.profileService
          .resetPassword(
            this.validateForm.controls['oldPassword'].value,
            this.validateForm.controls['newPassword'].value
          )
          .subscribe(
            (suite) => {
              console.log('Response: ', suite);
              this.validateForm.controls['oldPassword'].setValue('');
              this.validateForm.controls['newPassword'].setValue('');
            },
            (error) => console.log(error)
          );
      }
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.id = null;
  }

  inputChanged(event) {
    this.modelChanged.next(event.target.value);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  detailTestProfile(id: number) {
    this.id = id;
    this.router.navigate(['detalle-profile-pruebas'], { queryParams: { profileId: this.id } });
  }

}
