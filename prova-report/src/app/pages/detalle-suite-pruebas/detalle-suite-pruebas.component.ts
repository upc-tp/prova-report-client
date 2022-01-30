import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SuiteView } from 'src/app/interfaces/suites';
import { SuitesService } from '../../services/suites.service';
import { TestCaseService } from '../../services/testcase.service';

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
    registerDate: string;
    registerBy: string;
  }> = [];

  suite: SuiteView = {
    id: 0,
    createdAt: '',
    createdBy: '',
    modifiedAt: '',
    modifiedBy: '',
    title: '',
    description: '',
    project: ''
  };
  id: number;
  saved: boolean = false;
  updated: boolean = false;
  page: number = 1;
  pageSize: number = 10;
  count: number = this.pageSize;
  isVisible = false;
  isOkLoading = false;
  validateForm!: FormGroup;
  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 500;

  constructor(private route:ActivatedRoute, private suiteService:SuitesService, private testCaseService:TestCaseService, private fb:FormBuilder) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
    this.suiteId = params.suiteId;
    });
    this.fetchTestCases(this.page, this.pageSize);
    this.getSuite();
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]]
    });

    this.subscription = this.modelChanged
      .pipe(debounceTime(this.debounceTime))
      .subscribe((search: string) => {
        this.fetchTestCases(this.page, this.pageSize, search);
      });
  }
  getSuite(){
    this.suiteService.getTestSuite(this.suiteId).subscribe((res) => {
      this.suite.id = this.suiteId;
      this.suite.title = res.result.title;
      this.suite.description = res.result.description;
      this.suite.createdBy = res.result.createdBy;
      this.suite.createdAt = res.result.createdAt;
      this.suite.project = res.result.project.title;
    });
  }
  fetchTestCases(page: number, pageSize: number, search: string = ''){
    this.testCaseService.getTestCases(page,pageSize,search,this.suiteId).subscribe(
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

  submitForm(): void {
    if (this.validateForm.valid) {
      if (this.id) {
        this.testCaseService
          .updateTestCase(
            this.validateForm.controls['title'].value,
            this.validateForm.controls['description'].value,
            this.suiteId,
            this.id
          )
          .subscribe(
            (testCase) => {
              this.fetchTestCases(this.page, this.pageSize);
              console.log('Response: ', testCase);
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
        
        this.testCaseService
          .createTestCase(
            this.validateForm.controls['title'].value,
            this.validateForm.controls['description'].value,
            parseInt(this.suiteId.toString())
          )
          .subscribe(
            (suite) => {
              this.fetchTestCases(this.page, this.pageSize);
              console.log('Response: ', suite);
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
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



}
