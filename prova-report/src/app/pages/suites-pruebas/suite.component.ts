import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuitesService } from '../../services/suites.service';

@Component({
  selector: 'app-suite',
  templateUrl: './suite.component.html',
  styleUrls: ['./suite.component.scss'],
})
export class SuiteComponent implements OnInit {
  data: Array<{
    title: string;
    description: string;
    registerDate: string;
    registerBy: string;
  }> = [];
  isVisible = false;
  isOkLoading = false;
  validateForm!: FormGroup;

  constructor(private suiteService: SuitesService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fetchSuites();
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.suiteService
        .createTestSuite(
          this.validateForm.controls['title'].value,
          this.validateForm.controls['description'].value
        )
        .subscribe(
          (suite) => {
            this.fetchSuites();
            console.log('Response: ', suite);
          },
          (error) => console.log(error)
        );
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  fetchSuites() {
    this.suiteService.getTestSuites().subscribe(
      (res) =>
        (this.data = res.result.map((tSuite) => {
          return {
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
  }
}
