import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectService } from '../../services/projects.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

  constructor(private projectService: ProjectService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fetchProjects();
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
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

  fetchProjects() {
    this.projectService.getTestProjects().subscribe(
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
