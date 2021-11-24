import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SuitesService } from '../../services/suites.service';

@Component({
  selector: 'app-suite',
  templateUrl: './suite.component.html',
  styleUrls: ['./suite.component.scss'],
})
export class SuiteComponent implements OnInit, OnDestroy {
  data: Array<{
    id: number;
    title: string;
    description: string;
    registerDate: string;
    registerBy: string;
  }> = [];
  isVisible = false;
  isOkLoading = false;
  validateForm!: FormGroup;
  id: number;
  saved: boolean = false;
  updated: boolean = false;

  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 500;

  constructor(private suiteService: SuitesService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fetchSuites();
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });

    this.subscription = this.modelChanged
      .pipe(debounceTime(this.debounceTime))
      .subscribe((search: string) => {
        this.fetchSuites(search);
      });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      if (this.id) {
        this.suiteService
          .updateTestSuite(
            this.validateForm.controls['title'].value,
            this.validateForm.controls['description'].value,
            this.id
          )
          .subscribe(
            (suite) => {
              this.fetchSuites();
              console.log('Response: ', suite);
              this.isVisible = false;
              this.id = null;
              this.updated = true;
              setTimeout(function () {
                this.updated = false;
                console.log('Updated: ', this.updated);
              }.bind(this), 10000);
              this.validateForm.controls['title'].setValue('');
              this.validateForm.controls['description'].setValue('');
            },
            (error) => console.log(error)
          );
      } else {
        this.suiteService
          .createTestSuite(
            this.validateForm.controls['title'].value,
            this.validateForm.controls['description'].value
          )
          .subscribe(
            (suite) => {
              this.fetchSuites();
              console.log('Response: ', suite);
              this.isVisible = false;
              this.saved = true;
              setTimeout(function () {
                this.saved = false;
                console.log('Saved: ', this.saved);
              }.bind(this), 10000);
              this.validateForm.controls['title'].setValue('');
              this.validateForm.controls['description'].setValue('');
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

  fetchSuites(search: string = '') {
    this.suiteService.getTestSuites(search).subscribe(
      (res) =>
        (this.data = res.result.map((tSuite) => {
          return {
            id: tSuite.id,
            title: tSuite.title,
            description: tSuite.description,
            registerDate: new Date(tSuite.createdAt).toLocaleDateString(),
            registerBy: 'manuel@gmail.com',
          };
        }))
    );
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

  updateSuite(id: number) {
    this.id = id;
    this.suiteService.getTestSuite(id).subscribe((res) => {
      this.validateForm.get('title').setValue(res.result.title);
      this.validateForm.get('description').setValue(res.result.description);
      this.isVisible = true;
    });
  }
}
