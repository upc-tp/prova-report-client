import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectService } from '../../services/projects.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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
  validateForm!: FormGroup;
  id: number;
  saved: boolean = false;
  updated: boolean = false;

  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 500;

  constructor(
    private projectService: ProjectService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.fetchProjects();
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });

    this.subscription = this.modelChanged
      .pipe(debounceTime(this.debounceTime))
      .subscribe((search: string) => {
        this.fetchProjects(search);
      });
  }

  submitForm(): void {
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
              this.fetchProjects();
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
        this.projectService
          .createTestProject(
            this.validateForm.controls['title'].value,
            this.validateForm.controls['description'].value
          )
          .subscribe(
            (project) => {
              this.fetchProjects();
              console.log('Response: ', project);
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

  fetchProjects(search: string = '') {
    this.projectService.getTestProjects(search).subscribe(
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

  updateProject(id: number) {
    this.id = id;
    this.projectService.getTestProject(id).subscribe((res) => {
      this.validateForm.get('title').setValue(res.result.title);
      this.validateForm.get('description').setValue(res.result.description);
      this.isVisible = true;
    });
  }
}
