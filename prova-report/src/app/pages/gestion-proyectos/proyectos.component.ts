import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectService } from '../../services/projects.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss'],
})
export class ProyectosComponent implements OnInit {
  data: Array<{
    id: number;
    title: string;
    description: string;
    registerDate: string;
    registerBy: string;
  }> = [];

  isVisible = false;
  isOkLoading = false;
  submitted = false;
  validateForm: FormGroup;
  id: number;
  page: number = 1;
  pageSize: number = 10;
  count: number = this.pageSize;
  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 500;

  constructor(
    private projectService: ProjectService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchProjects(this.page, this.pageSize);
    this.validateForm = this.fb.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
    });

    this.subscription = this.modelChanged
      .pipe(debounceTime(this.debounceTime))
      .subscribe((search: string) => {
        this.fetchProjects(this.page, this.pageSize, search);
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.validateForm.controls; }

  submitForm(): void {
    this.submitted = true;
    if (this.validateForm.valid) {
      if (this.id) {
        this.projectService
          .updateTestProject(
            this.validateForm.controls['title'].value,
            this.validateForm.controls['description'].value,
            this.id
          )
          .subscribe(
            (suite) => {
              this.fetchProjects(this.page, this.pageSize);
              console.log('Response: ', suite);
              this.isVisible = false;
              this.submitted = false;
              this.id = null;
              this.validateForm.controls['title'].setValue('');
              this.validateForm.controls['description'].setValue('');
            },
            (error) => console.log(error)
          );
      } else {
        this.projectService
          .createTestProject(
            this.validateForm.controls['title'].value,
            this.validateForm.controls['description'].value
          )
          .subscribe(
            (project) => {
              this.page = 1;
              this.fetchProjects(this.page, this.pageSize);
              console.log('Response: ', project);
              this.isVisible = false;
              this.submitted = false;
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

  fetchProjects(page: number, pageSize: number, search: string = '') {
    this.projectService.getTestProjects(page, pageSize, search).subscribe(
      (res) => {
        this.data = res.result.map((tSuite) => {
          return {
            id: tSuite.id,
            title: tSuite.title,
            description: tSuite.description,
            registerDate: new Date(tSuite.createdAt).toLocaleDateString(),
            registerBy: 'manuel@gmail.com',
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
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
      this.submitted = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.submitted = false;
    this.id = null;
    this.validateForm.controls['title'].setValue('');
    this.validateForm.controls['description'].setValue('');
  }

  inputChanged(event) {
    this.modelChanged.next(event.target.value);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  detailProject(id: number){
    this.id = id;
    this.router.navigate(['detalle-proyectos'],{queryParams:{projectId:this.id}});  
  }

  updateProject(id: number) {
    this.id = id;
    this.projectService.getTestProject(id).subscribe((res) => {
      this.validateForm.get('title').setValue(res.result.title);
      this.validateForm.get('description').setValue(res.result.description);
      this.isVisible = true;
    });
  }

  onPageIndexChange(selectedPage: number) {
    this.page = selectedPage;
    this.fetchProjects(this.page, this.pageSize);
  }
}
