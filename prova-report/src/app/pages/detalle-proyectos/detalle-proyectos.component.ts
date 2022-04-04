import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Project } from 'src/app/interfaces/projects';
import { ProjectService } from '../../services/projects.service';
import { TestCaseService } from '../../services/testcase.service';
import { Router } from '@angular/router';
import { tick } from '@angular/core/testing';
@Component({
  selector: 'app-detalle-proyectos',
  templateUrl: './detalle-proyectos.component.html',
  styleUrls: ['./detalle-proyectos.component.scss']
})

export class DetalleProyectosComponent implements OnInit {
    projectId: number;
    testCases: Array<{
      id:number;
      title: string;
      description: string;
      testStatus:string;
      testSuite: string;
      registerDate: string;
      registerBy: string;
    }> = [];
    collaborators: Array<{
      uid: number;
      email: string;
      role: string;
      firstName: string;
      lastName: string;
      password: string;
    }> = [];
    project: Project = {
      id: 0,
      createdAt: '',
      createdBy: '',
      modifiedAt: '',
      modifiedBy: '',
      title: '',
      description: '',
    };
    roles: Array<{
      label: string;
      value: number;
    }> = [
      {label: "Tester", value: 1},
      {label: "Admin", value: 2}
    ];
    id: number;
    saved: boolean = false;
    updated: boolean = false;
    page: number = 1;
    pageSize: number = 10;
    count: number = 0;
    isVisible = false;
    isOkLoading = false;
    validateForm!: FormGroup;
    private modelChanged: Subject<string> = new Subject<string>();
    private subscription: Subscription;
    debounceTime = 500;
  
    constructor(private route:ActivatedRoute, private projectService:ProjectService, private testCaseService:TestCaseService, private router: Router,private fb:FormBuilder) { }
  
    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
      this.projectId = params.projectId;
      });
      //this.fetchTestCases(this.page, this.pageSize);
      this.getProject();
      this.validateForm = this.fb.group({
        firstName: [null, [Validators.required]],
        lastName: [null, [Validators.required]],
        email: [null, [Validators.required]],
        selectRole: [null, [Validators.required]],
        password: [null, [Validators.required]]
      });
      this.getProjectCollaborators();
      this.subscription = this.modelChanged
        .pipe(debounceTime(this.debounceTime))
        .subscribe((search: string) => {
          this.fetchTestCases(this.page, this.pageSize, search);
        });
    }
    getProject(){
      this.projectService.getTestProject(this.projectId).subscribe((res) => {
        this.project.id = this.projectId;
        this.project.title = res.result.title;
        this.project.description = res.result.description;
        this.project.createdBy = res.result.createdBy;
        this.project.createdAt = res.result.createdAt;
      });
    }
    fetchTestCases(page: number, pageSize: number, search: string = ''){
      this.testCaseService.getTestCases(page,pageSize,search,this.projectId).subscribe(
        res =>{
            this.testCases = res.result.map((tCase) =>{
              return{
                id: tCase.id,
                title: tCase.title,
                description: tCase.title,
                testStatus: tCase.testState.name,
                testSuite: tCase.testSuite.title,
                registerDate: new Date(tCase.createdAt).toLocaleDateString(),
                registerBy: tCase.createdBy 
              };
            }
          );
          this.page = res.page;
          this.pageSize = res.pageSize;
          this.count = res.count;
        }
      );
    }
    
    inputChanged(event) {
      this.modelChanged.next(event.target.value);
    }
    onPageIndexChange(selectedPage: number) {
      this.page = selectedPage;
      this.fetchTestCases(this.page, this.pageSize);
    }
    handleCancel(): void {
      this.isVisible = false;
      this.id = null;
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
  
    backTestProjects(){
      this.router.navigate(['gestion-proyectos']);  
    }
    getProjectCollaborators(){
      this.projectService
        .getCollaborators(null, null, '', this.projectId).subscribe(
          (res) => (
            this.collaborators = res.result.map((tcollaborator) => {
              return {
                uid: tcollaborator.uid,
                email: tcollaborator.email,
                role: tcollaborator.role,
                firstName: tcollaborator.firstName,
                lastName: tcollaborator.lastName,
                password: tcollaborator.password
              };
            })
          )
        )
    }
    
    submitForm(): void {
      if (this.validateForm.valid) {
          this.projectService
            .createCollaborator(
              this.validateForm.controls['firstName'].value,
              this.validateForm.controls['lastName'].value,
              this.validateForm.controls['email'].value,
              this.validateForm.controls['password'].value,
              this.validateForm.controls['selectRole'].value,
              parseInt(this.projectId.toString())
            )
            .subscribe(
              (project) => {
                this.getProjectCollaborators();
                console.log('Response: ', project);
                this.isVisible = false;
                this.saved = true;
                setTimeout(function () {
                  this.saved = false;
                  console.log('Saved: ', this.saved);
                }.bind(this), 10000);
                this.validateForm.controls['firstName'].setValue('');
                this.validateForm.controls['lastName'].setValue('');
                this.validateForm.controls['email'].setValue('');
                this.validateForm.controls['password'].setValue('');
                this.validateForm.controls['selectRole'].setValue(0);
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

    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }
  
  
  
  }