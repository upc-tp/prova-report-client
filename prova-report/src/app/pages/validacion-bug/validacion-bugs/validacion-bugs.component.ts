import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Filter } from 'src/app/interfaces/global.model';
import { SuitesService } from 'src/app/services/suites.service';
import { ProjectService } from 'src/app/services/projects.service';
import { TestCaseService } from 'src/app/services/testcase.service';
import Swal from 'sweetalert2';
import { Subject, Subscription } from 'rxjs';
import { Defect } from '../models/Defect.model';
import { DefectService } from 'src/app/services/defect.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { DefectData } from 'src/app/interfaces/defect';


@Component({
    selector: 'app-validacion-bugs',
    templateUrl: './validacion-bugs.component.html',
    styleUrls: ['./validacion-bugs.component.scss']
  })

  export class ValidacionBugsComponent implements OnInit {
    
    isVisible = false;
    isOkLoading = false;
    validateForm!: FormGroup;
    id: number;
    page: number = 1;
    pageSize: number = 10;
    count: number = this.pageSize;
    private modelChanged: Subject<string> = new Subject<string>();
    private subscription: Subscription;
    debounceTime = 500;
    
      filterFormGroup: FormGroup;
      listProjects: Filter[] = [];
      listTestSuite: Filter[] = [];
      listTestCase: Filter[] = [];
      listDefect: Defect[] = [];
      dataSourceDefect = new MatTableDataSource<Defect>();
      constructor(private _fb: FormBuilder,
        private _sanitizer: DomSanitizer,
        private iconRegistry: MatIconRegistry,
        private suiteService:SuitesService,
        private ProjectService:ProjectService,
        private testCaseService:TestCaseService,
        private defectService:DefectService
        ) {}
      defectSelected: Defect;
      @ViewChild(MatPaginator) paginator: MatPaginator;
      @ViewChild(MatSort) sort: MatSort;

      data: Array<{
        id: number;
        title: string;
        repro_steps: string;
        priority: string;
        severity: string;
      }> = [];

      ngOnInit(): void {
          this.filterFormGroup = this._fb.group({
              projects: ['', [Validators.required]],
              testSuite: ['', [Validators.required]],
              testCase: ['', [Validators.required]]
          });
          this.getProjects();
      }
      
      getProjects(){
        this.ProjectService.getTestProjects(null,null,'').subscribe(
          (res) => (
            this.listProjects = res.result.map((project) => {
              const filtProject = new Filter();
              filtProject.group = 0;
              filtProject.key = project.id;
              filtProject.value = project.title;
              return filtProject;
            }
            )
          )
        );
      }
      validaciones(campo: string): boolean {
        return (
          this.filterFormGroup.get(campo).invalid &&
          this.filterFormGroup.get(campo).touched
        );
      }
      
      search() {
        if (!this.filterFormGroup.invalid) {
          this.defectService.getDefects(null,null,'',this.filterFormGroup.controls['testCase'].value).subscribe(
            res => {
              this.data = res.result.map((defect) => {
                return {
                  id: defect.id,
                  title: defect.title,
                  repro_steps: defect.repro_steps,
                  priority: defect.priority.name,
                  severity: defect.severity.name,
                };
              });
            }
          );
        }
      }
    
      filterTableDefect(e:Event){
        const filterValue = (e.target as HTMLInputElement).value;
        this.dataSourceDefect.filter = filterValue
        .trim()
        .toLowerCase();
      }
    
      updateFilter(e: any) {
        if(e.source.ngControl.name == 'projects'){
          this.suiteService.getTestSuitesByProject(null,null,'',e.value).subscribe(
            res => {
              console.log(res);
              this.listTestSuite = res.result.map((testSuite) => {
                const filtTestSuite = new Filter();
                filtTestSuite.group = 1;
                filtTestSuite.key = testSuite.id;
                filtTestSuite.value = testSuite.title;
                return filtTestSuite;
              });
            }
          )
        }
        if(e.source.ngControl.name == 'testSuite') {
          this.testCaseService.getTestCasesBySuite(null, null, '', e.value).subscribe(
            res => {
              console.log(res);
              this.listTestCase = res.result.map((testCase) => {
                const filtTestCase = new Filter();
                filtTestCase.group = 1;
                filtTestCase.key = testCase.id;
                filtTestCase.value = testCase.title;
                return filtTestCase;
              });
            }
          )}
      }

      send(): void {
        this.isVisible = true;
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

      checked = false;
      indeterminate = false;
      listOfCurrentPageData: readonly DefectData[] = [];
      listOfData: readonly DefectData[] = [];
      setOfCheckedId = new Set<number>();

      updateCheckedSet(id: number, checked: boolean): void {
        if (checked) {
          this.setOfCheckedId.add(id);
        } else {
          this.setOfCheckedId.delete(id);
        }
      }
    
      onItemChecked(id: number, checked: boolean): void {
        this.updateCheckedSet(id, checked);
        this.refreshCheckedStatus();
      }
    
      onAllChecked(value: boolean): void {
        this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
        this.refreshCheckedStatus();
      }
    
      onCurrentPageDataChange($event: readonly DefectData[]): void {
        this.listOfCurrentPageData = $event;
        this.refreshCheckedStatus();
      }
    
      refreshCheckedStatus(): void {
        this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
        this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
      }
  }