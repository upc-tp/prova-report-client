import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ProjectService } from 'src/app/services/projects.service';
import { SuitesService } from '../../services/suites.service';
import { Router } from '@angular/router';
import { PlanService } from 'src/app/services/plan.service';
import Swal from 'sweetalert2';

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
  testPlans: Array<{
    label: string;
    value: number;
  }> = [];
  isVisible = false;
  isVisibleMassive = false;
  submitted = false;
  isOkLoading = false;
  isOkLoadingMassive = false;
  validateForm!: FormGroup;
  formMassive: FormGroup;
  id: number;
  sProject: number = 0;
  page: number = 1;
  pageSize: number = 10;
  count: number = this.pageSize;
  file: any;
  csvData: string[] = [];

  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 500;

  constructor(
    private suiteService: SuitesService,
    private planService: PlanService, 
    private projectService: ProjectService, 
    private fb: FormBuilder, 
    private router: Router) { }

  ngOnInit(): void {
    this.fetchSuites(this.page, this.pageSize);
    this.getProjects();
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      selectProject: [null, [Validators.required]],
      selectPlan: [null, [Validators.required]]
    });


    this.formMassive = this.fb.group({
      projects: [null, [Validators.required]],
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
            this.f['title'].value,
            this.f['description'].value,
            this.f['selectProject'].value,
            this.id,
            this.f['selectPlan'].value
          )
          .subscribe(
            (suite) => {
              this.fetchSuites(this.page, this.pageSize);
              console.log('Response: ', suite);
              this.isVisible = false;
              this.submitted = false;
              this.id = null;
              this.f['title'].setValue('');
              this.f['description'].setValue('');
              this.f['selectProject'].setValue(null);
              this.f['selectPlan'].setValue(null);
            },
            (error) => console.log(error)
          );
      } else {
        this.suiteService
          .createTestSuite(
            this.f['title'].value,
            this.f['description'].value,
            this.f['selectProject'].value,
            this.f['selectPlan'].value
          )
          .subscribe(
            (suite) => {
              this.fetchSuites(this.page, this.pageSize);
              console.log('Response: ', suite);
              this.isVisible = false;
              this.submitted = false;
              this.f['title'].setValue('');
              this.f['description'].setValue('');
              this.f['selectProject'].setValue(null);
              this.f['selectPlan'].setValue(null);
            },
            (error) => console.log(error)
          );
      }
    } else {
      Object.values(this.f).forEach((control) => {
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

  getTestPlans(projectId: number) {
    this.planService.getTestPlansForSelect(projectId).subscribe(res => {
      this.testPlans = res.result.map(tPlan => {
        console.log(tPlan);
        return {
          label: tPlan.title,
          value: tPlan.id
        }
      });
    });
  }

  onSelectProject(projectId: number) {
    this.f['selectPlan'].setValue(null);
    this.getTestPlans(projectId);
  }

  fetchSuites(page: number, pageSize: number, search: string = '') {
    this.suiteService.getTestSuites(page, pageSize, search).subscribe(
      res => {
        this.data = res.result.map((tSuite) => {
          return {
            id: tSuite.id,
            tag: tSuite.tag,
            title: tSuite.title,
            description: tSuite.description,
            project: tSuite.project.title,
            testPlan: tSuite.testPlan?.title,
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

  showModalMassive(): void {
    this.isVisibleMassive = true;
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
    this.f['title'].setValue('');
    this.f['description'].setValue('');
    this.f['selectProject'].setValue(null);
    this.f['selectPlan'].setValue(null);
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
      this.validateForm.get('selectPlan').setValue(res.result.testPlan?.id);
      this.isVisible = true;
    });
  }

  onPageIndexChange(selectedPage: number) {
    this.page = selectedPage;
    this.fetchSuites(this.page, this.pageSize);
  }

  fileChanged(e) {
    this.file = e.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsText(this.file);
    fileReader.onload = (e) => {
      if (e.target.readyState == FileReader.DONE) {
        let xmlData = e.target.result as string;
        this.csvData.push(xmlData);
      }
      console.log(this.csvData);
    };
  }

  enviarCsvData(){
    console.log(this.csvData[0]);
    if (this.file) {
      this.suiteService
        .bulkLoadSuites(
          this.formMassive.controls['projects'].value,
          this.csvData[0]
        )
        .subscribe((res) => {
          console.log(res.result);
          this.fetchSuites(this.page, this.pageSize);
          this.deleteFile();
        });
    } else {
      Swal.fire({
        title: 'Debes cargar un archivo para registrar la ejecución',
        showCloseButton: true,
        icon: 'info',
      });
    }
  }

  handleOkMassive(): void {
    this.isOkLoadingMassive = true;
    setTimeout(() => {
      this.isVisibleMassive = false;
      this.isOkLoadingMassive = false;
    }, 3000);
  }

  handleCancelMassive(): void {
    this.isVisibleMassive = false;
  }

  deleteFile() {
    this.file = null;
    this.csvData = [];
  }
}
