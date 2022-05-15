import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SuiteView } from 'src/app/interfaces/suites';
import { SuitesService } from '../../services/suites.service';
import { TestCaseService } from '../../services/testcase.service';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/projects.service';
import { PriorityService } from 'src/app/services/priority.services';
import { SeverityService } from 'src/app/services/seveities.services';
import { UtilsService } from 'src/app/common/UtilsService';
import { TestCaseSelected } from '../../interfaces/testcase';
@Component({
  selector: 'app-detalle-suite-pruebas',
  templateUrl: './detalle-suite-pruebas.component.html',
  styleUrls: ['./detalle-suite-pruebas.component.scss']
})

export class DetalleSuitePruebasComponent implements OnInit {
  suiteId: number;
  testCases: Array<{
    id:number;
    title: string;
    description: string;
    testStatus:string;
    testSuite: string;
    priority: string;
    priorityIcon: string;
    severityIcon: string;
    severity: string;
    registerDate: string;
    registerBy: string;
  }> = [];

 tCaseSelected: TestCaseSelected;

  priorities: Array<{
    label: string;
    value: number;
  }> = [];
  severities: Array<{
    label: string;
    value: number;
  }> = [];

  suite: SuiteView = {
    id: 0,
    createdAt: '',
    createdBy: '',
    modifiedAt: '',
    modifiedBy: '',
    title: '',
    description: '',
    project: '',
    projectId: 0,
    tag:''
  };

  collaborators: Array<{
    label: string;
    value: number;
  }> = [];

  id: number;
  saved: boolean = false;
  updated: boolean = false;
  submitted = false;
  page: number = 1;
  pageSize: number = 10;
  count: number = 0;
  isVisible = false;
  isOkLoading = false;
  validateForm!: FormGroup;
  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 500;
  isDetailVisible: boolean = false;

  constructor(private route:ActivatedRoute, public utils: UtilsService, private projectService:ProjectService,  private priorityService: PriorityService, private seveityService: SeverityService, private suiteService:SuitesService, private testCaseService:TestCaseService, private router: Router,private fb:FormBuilder) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
    this.suiteId = params.suiteId;
    });
    this.fetchTestCases(this.page, this.pageSize);
    this.getSuite();
    this.getPriority();
    this.getSeverity();
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      selectCollaborator: [null],
      selectPriority: [null, [Validators.required]],
      selectSeverity: [null, [Validators.required]]
    });
    this.subscription = this.modelChanged
      .pipe(debounceTime(this.debounceTime))
      .subscribe((search: string) => {
        this.fetchTestCases(this.page, this.pageSize, search);
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.validateForm.controls; }

  getSuite(){
    this.suiteService.getTestSuite(this.suiteId).subscribe((res) => {
      this.suite.id = this.suiteId;
      this.suite.title = res.result.title;
      this.suite.description = res.result.description;
      this.suite.createdBy = res.result.createdBy;
      this.suite.createdAt = this.utils.formatDateTime(new Date(res.result.createdAt));
      this.suite.project = res.result.project.title;
      this.suite.projectId = res.result.project.id;
      this.suite.tag = res.result.tag;
      // Una vez que carga el suite de pruebas, obtiene los colaboradores del suite seleccionado
      this.getProjectCollaborators();
    });
  }

  getPriority() {
    this.priorityService.getPriorities(null, null, '').subscribe(
      (res) => (
        this.priorities = res.result.map((tPriority) => {
          return {
            label: tPriority.name,
            value: tPriority.id
          };
        })
      )

    );
  }

  getSeverity() {
    this.seveityService.getSeverities(null, null, '').subscribe(
      (res) => (
        this.severities = res.result.map((tSeverity) => {
          return {
            label: tSeverity.name,
            value: tSeverity.id
          };
        })
      )

    );
  }

  fetchTestCases(page: number, pageSize: number, search: string = ''){
    this.testCaseService.getTestCases(page,pageSize,search,this.suiteId,null).subscribe(
      res =>{
          this.testCases = res.result.map((tCase) =>{
            return{
              id: tCase.id,
              tag: tCase.tag,
              title: tCase.title,
              description: tCase.description,
              testStatus: tCase.testState.name,
              testSuite: tCase.testSuite.title,
              priority: tCase.priority.name,
              priorityIcon: tCase.priority.name === "Baja" ? '/assets/images/low-priority.png'  : tCase.priority.name === "Media" ? '/assets/images/middle-priority.png' : '/assets/images/high-priority.png',
              severityIcon: tCase.severity.name === "Trivial" ? '/assets/images/trivial.png'  : tCase.severity.name === "Normal" ? '/assets/images/normal.png' : '/assets/images/critico.png',
              severity: tCase.severity.name,
              collaborator: tCase.userInCharge,
              registerDate: this.utils.formatDate(new Date(tCase.createdAt)),
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
    this.submitted = false;
    this.id = null;
    this.tCaseSelected = null;
    this.isDetailVisible = false;
    this.validateForm.controls['title'].setValue('');
    this.validateForm.controls['description'].setValue('');
    this.validateForm.controls['selectPriority'].setValue(0);
    this.validateForm.controls['selectSeverity'].setValue(0);
    this.validateForm.controls['selectCollaborator'].setValue(0);
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

  getProjectCollaborators(){
    this.projectService
      .getCollaborators(null, null, '', this.suite.projectId).subscribe(
        (res) => (
          this.collaborators = res.result.map((tcollaborator) => {
            return {
              label: tcollaborator.email,
              value: tcollaborator.uid
              
            };
          })
        )
      )
  }

  detailCase(tCaseSelect: TestCaseSelected){
    console.log(tCaseSelect);
    this.tCaseSelected = tCaseSelect;
    this.isDetailVisible = true;
  }

  backTestSuites(){
    this.router.navigate(['suite-pruebas']);
  }
  submitForm(): void {
    this.submitted = true;
    if (this.validateForm.valid) {
      if (this.id) {
        this.testCaseService
          .updateTestCase(
            this.validateForm.controls['title'].value,
            this.validateForm.controls['description'].value,
            this.suiteId,
            this.id,
            this.validateForm.controls['selectPriority'].value,
            this.validateForm.controls['selectSeverity'].value,
            parseInt(this.validateForm.controls['selectCollaborator'].value)
          )
          .subscribe(
            (testCase) => {
              this.fetchTestCases(this.page, this.pageSize);
              console.log('Response: ', testCase);
              this.isVisible = false;
              this.id = null;
              this.updated = true;
              this.submitted = false;
              setTimeout(function () {
                this.updated = false;
                console.log('Updated: ', this.updated);
              }.bind(this), 10000);
              this.validateForm.controls['title'].setValue('');
              this.validateForm.controls['description'].setValue('');
              this.validateForm.controls['selectPriority'].setValue(0);
              this.validateForm.controls['selectSeverity'].setValue(0);
              this.validateForm.controls['selectCollaborator'].setValue(0);
            },
            (error) => console.log(error)
          );
      } else {

        this.testCaseService
          .createTestCase(
            this.validateForm.controls['title'].value,
            this.validateForm.controls['description'].value,
            this.validateForm.controls['selectPriority'].value,
            this.validateForm.controls['selectSeverity'].value,
            parseInt(this.suiteId.toString()),
            parseInt(this.validateForm.controls['selectCollaborator'].value)
          )
          .subscribe(
            (suite) => {
              this.fetchTestCases(this.page, this.pageSize);
              console.log('Response: ', suite);
              this.isVisible = false;
              this.submitted = false;
              this.saved = true;
              setTimeout(function () {
                this.saved = false;
                console.log('Saved: ', this.saved);
              }.bind(this), 10000);
              this.validateForm.controls['title'].setValue('');
              this.validateForm.controls['description'].setValue('');
              this.validateForm.controls['selectPriority'].setValue(0);
              this.validateForm.controls['selectSeverity'].setValue(0);
              this.validateForm.controls['selectCollaborator'].setValue(0);
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

  updateCase(id:number){
    this.id = id;
    this.testCaseService.getTestCase(id).subscribe((res) => {
      this.validateForm.get('title').setValue(res.result.title);
      this.validateForm.get('description').setValue(res.result.description);
      if(res.result.userInCharge != null){
        this.validateForm.get('selectCollaborator').setValue(res.result.userInCharge.uid);
      }
      this.validateForm.get('selectSeverity').setValue(res.result.severity.id);
      this.validateForm.get('selectPriority').setValue(res.result.priority.id);
      this.isVisible = true; 
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



}
