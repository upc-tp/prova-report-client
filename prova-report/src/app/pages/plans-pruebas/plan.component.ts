import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ProjectService } from 'src/app/services/projects.service';
import { PlanService } from 'src/app/services/plan.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PlanView } from 'src/app/interfaces/plan';
import { Filter } from 'src/app/interfaces/global.model';
import { UtilsService } from 'src/app/common/UtilsService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss'],
})
export class PlanComponent implements OnInit, OnDestroy {
  isDetailVisible= false;
  isVisibleProjectUpdateform = true;
  isFilterVisible=true;
  filterFormGroup: FormGroup;
  listProjects: Filter[] = [];
  listTestPlans: Filter[] = [];
  projectId: number;
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
  plan: PlanView = {
    createdAt: '',
	  createdBy: '',
	  modifiedAt: '',
	  modifiedBy: '',
	  id: 0,
	  title: '',
	  description: '',
	  project: '',
	  projectId: 0,
  };
  isVisible = false;
  submitted = false;
  isOkLoading = false;
  validateForm!: FormGroup;
  id: number;
  sProject: number = 0;
  page: number = 2;
  pageSize: number = 10;
  count: number = this.pageSize;

  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 500;

  constructor(private planService: PlanService, private projectService: ProjectService, private fb: FormBuilder, private router: Router, public utils: UtilsService, private _sanitizer: DomSanitizer, private iconRegistry: MatIconRegistry) { 
    this.iconRegistry.addSvgIcon(
      'NoTest',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/no-test.svg')
    );
  }

  ngOnInit(): void {
    this.getProjectsFilter();
    this.filterFormGroup = this.fb.group({
      projects: ['', [Validators.required]],});
    //this.fetchPlans(this.page, this.pageSize);
    console.log(this.listProjects);
    //this.getProjects();
  
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      selectProject: [null, [Validators.required]]
    });

    this.subscription = this.modelChanged
      .pipe(debounceTime(this.debounceTime))
      .subscribe((search: string) => {
        this.fetchPlans(this.page, this.pageSize, search);
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.validateForm.controls; }

  submitForm(): void {
    this.submitted = true;
    if (this.validateForm.valid) {
      if (this.id) {
        this.planService
          .updateTestPlan(
            this.validateForm.controls['title'].value,
            this.validateForm.controls['description'].value,
            this.validateForm.controls['selectProject'].value,
            this.id
          )
          .subscribe(
            (plan) => {
              this.fetchPlans(this.page, this.pageSize);
              console.log('Response: ', plan);
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
        this.planService
          .createTestPlan(
            this.validateForm.controls['title'].value,
            this.validateForm.controls['description'].value,
            this.validateForm.controls['selectProject'].value
          )
          .subscribe(
            (plan) => {
              this.fetchPlans(this.page, this.pageSize);
              console.log('Response: ', plan);
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

  getProjectsFilter(){
    this.projectService.getTestProjects(null, null, '').subscribe(
      (res) =>
        (this.listProjects = res.result.map((project) => {
          const filtProject = new Filter();
          filtProject.group = 0;
          filtProject.key = project.id;
          filtProject.value = project.title;
          console.log(filtProject)
          return filtProject;
        }))
    );
  }

  search(){
    if (!this.filterFormGroup.invalid) {
      this.planService
        .getTestPlansByProject(
          null,
          null,
          '',
          this.filterFormGroup.controls['projects'].value
        )
        .subscribe(res => {
          this.data = res.result.map((tPlan) => {
            return {
              id: tPlan.id,
              title: tPlan.title,
              description: tPlan.description,
              project: tPlan.project.title,
              registerDate: new Date(tPlan.createdAt).toLocaleDateString(),
              registerBy: tPlan.createdBy,
            };
          });
          this.page = res.page;
          this.pageSize = res.pageSize;
          this.count = res.count;
          if (res.result.length == 0) {
            this.isFilterVisible = true;
            Swal.fire({
              title: 'El  no cuenta con planes de prueba',
              showCloseButton: true,
              icon: 'info',
            });
          }
          else{
            this.isFilterVisible = false;
          }
        }
        );
          //this.dataSourceTestCase = new MatTableDataSource(this.listTestCase);
          //this.Pagination();
    }
  }

  getPlansByProjectId(){
    this.planService.getTestPlansByProject(null, null, '', this.projectId).subscribe( (res) => {
      this.data = res.result.map( (plan) => {
        return{
          id: plan.id,
          title: plan.title,
          project: plan.project.title,
          description: plan.description,
          registerDate: plan.createdAt,
          registerBy: plan.createdBy,
        };
      });
      if(this.data.length == 0){
        Swal.fire(
          {
            title: 'No existen planes de prueba',
            showCloseButton:true,
            icon:'info'
          });
        this.filterFormGroup.controls['projects'].setValue('');
        this.projectId = null;
      }
    });
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

  detailPlan(id: number){
    this.id = id;
        this.planService.getTestPlan(id).subscribe((res) => {
            this.plan.id = this.id;
            this.plan.title = res.result.title;
            this.plan.description = res.result.description;
            this.plan.project = res.result.project.title;
            this.plan.createdAt = this.utils.formatDate(new Date(res.result.createdAt));
	          this.plan.createdBy = res.result.createdBy;
	          this.plan.modifiedAt = res.result.modifiedAt;
	          this.plan.modifiedBy = res.result.modifiedBy;
        })
        this.isDetailVisible = true;
  }

  fetchPlans(page: number, pageSize: number, search: string = '') {
    this.planService.getTestPlans(page, pageSize, search).subscribe(
      res => {
        this.data = res.result.map((tPlan) => {
          return {
            id: tPlan.id,
            title: tPlan.title,
            description: tPlan.description,
            project: tPlan.project.title,
            registerDate: new Date(tPlan.createdAt).toLocaleDateString(),
            registerBy: tPlan.createdBy,
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
      this.isDetailVisible = false;
      this.isOkLoading = false;
      this.isVisibleProjectUpdateform = true;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.submitted = false;
    this.isDetailVisible = false;
    this.isVisibleProjectUpdateform = true;
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

  detailTestPlan(id: number){
    this.id = id;
    this.router.navigate(['detalle-suite-pruebas'],{queryParams:{suiteId:this.id}});
  }

  validaciones(campo: string): boolean {
    return (
      this.filterFormGroup.get(campo).invalid &&
      this.filterFormGroup.get(campo).touched
    );
  }

  selectProject(){
    localStorage.removeItem('projectId');
    if(this.filterFormGroup.controls['projects'].value){
      this.projectId = this.filterFormGroup.controls['projects'].value;
      this.getPlansByProjectId();
    }else{
      Swal.fire(
        {
          title: 'Selecciona un proyecto',
          showCloseButton:true,
          icon:'info'
        });
    }
  }

  updatePlan(id: number) {
    this.id = id;
    this.planService.getTestPlan(id).subscribe((res) => {
      this.validateForm.get('title').setValue(res.result.title);
      this.validateForm.get('description').setValue(res.result.description);
      this.validateForm.get('selectProject').setValue(res.result.project.id);
      this.isVisible = true;
      this.isVisibleProjectUpdateform = false;
    });
  }

  onPageIndexChange(selectedPage: number) {
    this.page = selectedPage;
    this.fetchPlans(this.page, this.pageSize);
  }
}