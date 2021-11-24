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
    title: string;
    description: string;
    registerDate: string;
    registerBy: string;
  }> = [];
  isVisible = false;
  isOkLoading = false;
  validateForm!: FormGroup;

  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 500;

  constructor(private projectService: ProjectService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fetchProjects();
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });

    this.subscription = this.modelChanged
      .pipe(
        debounceTime(this.debounceTime),
      )
      .subscribe((search: string) => {
        this.fetchProjects(search);
      });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
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

  fetchProjects(search: string = '') {
    this.projectService.getTestProjects(search).subscribe(
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

  inputChanged(event) {
    this.modelChanged.next(event.target.value)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
