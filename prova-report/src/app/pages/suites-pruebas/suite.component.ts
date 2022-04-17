import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ProjectService } from 'src/app/services/projects.service';
import { SuitesService } from '../../services/suites.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suite',
  templateUrl: './suite.component.html',
  styleUrls: ['./suite.component.scss'],
})
export class SuiteComponent implements OnInit, OnDestroy {
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
  submitted = false;
  isOkLoading = false;
  validateForm!: FormGroup;
  id: number;
  sProject: number = 0;
  page: number = 1;
  pageSize: number = 10;
  count: number = this.pageSize;

  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 500;

  constructor(private suiteService: SuitesService, private projectService: ProjectService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.fetchSuites(this.page, this.pageSize);
    this.getProjects();
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      selectProject: [null, [Validators.required]]
    });

    this.subscription = this.modelChanged
      .pipe(debounceTime(this.debounceTime))
      .subscribe((search: string) => {
        this.fetchSuites(this.page, this.pageSize, search);
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.validateForm.controls; }

  submitForm(): void {
    this.submitted = true;
    if (this.validateForm.valid) {
      if (this.id) {
        this.suiteService
          .updateTestSuite(
            this.validateForm.controls['title'].value,
            this.validateForm.controls['description'].value,
            this.validateForm.controls['selectProject'].value,
            this.id
          )
          .subscribe(
            (suite) => {
              this.fetchSuites(this.page, this.pageSize);
              console.log('Response: ', suite);
              this.isVisible = false;
              this.submitted = false;
              this.id = null;
              this.validateForm.controls['title'].setValue('');
              this.validateForm.controls['description'].setValue('');
              this.validateForm.controls['selectProject'].setValue(0);
            },
            (error) => console.log(error)
          );
      } else {
        this.suiteService
          .createTestSuite(
            this.validateForm.controls['title'].value,
            this.validateForm.controls['description'].value,
            this.validateForm.controls['selectProject'].value
          )
          .subscribe(
            (suite) => {
              this.fetchSuites(this.page, this.pageSize);
              console.log('Response: ', suite);
              this.isVisible = false;
              this.submitted = false;
              this.validateForm.controls['title'].setValue('');
              this.validateForm.controls['description'].setValue('');
              this.validateForm.controls['selectProject'].setValue(0);
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

  getProjects() {
    this.projectService.getTestProjects(null, null, '').subscribe(
      (res) => (
        this.projects = res.result.map((tProject) => {
          return {
            label: tProject.title,
            value: tProject.id
          };
        })
      )

    );
  }

  fetchSuites(page: number, pageSize: number, search: string = '') {
    this.suiteService.getTestSuites(page, pageSize, search).subscribe(
      res => {
        this.data = res.result.map((tSuite) => {
          return {
            id: tSuite.id,
            title: tSuite.title,
            description: tSuite.description,
            project: tSuite.project.title,
            registerDate: new Date(tSuite.createdAt).toLocaleDateString(),
            registerBy: tSuite.createdBy,
          };
        });
        this.page = res.page;
        this.pageSize = res.pageSize;
        this.count = res.count;
      }
    );
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    this.submitted = false;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.submitted = false;
    this.id = null;
    this.validateForm.controls['title'].setValue('');
    this.validateForm.controls['description'].setValue('');
    this.validateForm.controls['selectProject'].setValue(0);
  }

  inputChanged(event) {
    this.modelChanged.next(event.target.value);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  detailTestSuite(id: number){
    this.id = id;
    this.router.navigate(['detalle-suite-pruebas'],{queryParams:{suiteId:this.id}});
  }

  updateSuite(id: number) {
    this.id = id;
    this.suiteService.getTestSuite(id).subscribe((res) => {
      this.validateForm.get('title').setValue(res.result.title);
      this.validateForm.get('description').setValue(res.result.description);
      this.validateForm.get('selectProject').setValue(res.result.project.id);
      this.isVisible = true;
    });
  }

  onPageIndexChange(selectedPage: number) {
    this.page = selectedPage;
    this.fetchSuites(this.page, this.pageSize);
  }
}
