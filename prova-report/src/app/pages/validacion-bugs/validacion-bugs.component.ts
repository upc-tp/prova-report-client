import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Filter } from 'src/app/interfaces/global.model';
import { SuitesService } from 'src/app/services/suites.service';
import { ProjectService } from 'src/app/services/projects.service';
import { TestCaseService } from 'src/app/services/testcase.service';
import Swal from 'sweetalert2';
import { TestCase } from '../ejecucion-casos-pruebas/models/TestCaseExecution.model';

@Component({
    selector: 'app-validacion-bugs',
    templateUrl: './validacion-bugs.component.html',
    styleUrls: ['./validacion-bugs.component.scss']
  })

  export class ValidacionBugsComponent implements OnInit {
      filterFormGroup: FormGroup;
      listProjects: Filter[] = [];
      listTestSuite: Filter[] = [];
      listTestCase: Filter[] = [];
      listBugs: Defects[] = [];
      dataSourceTestCase = new MatTableDataSource<TestCase>();
      constructor(private _fb: FormBuilder,
        private suiteService:SuitesService,
        private ProjectService:ProjectService,
        private testCaseService:TestCaseService
        ) {}
      testCaseSelected: TestCase;
      @ViewChild(MatPaginator) paginator: MatPaginator;
      @ViewChild(MatSort) sort: MatSort;
    
      headerColumn: string[] = [
        'title',
        'repro_steps',
        'defect_state',
        'priority',
        'severity',
        'testcase',
        'testexecution',
        'isfixed'
      ];
      ngOnInit(): void {
          this.filterFormGroup = this._fb.group({
              projects: ['', [Validators.required]],
              testSuite: ['', [Validators.required]],
              testCase: ['', [Validators.required]]
          });
          this.getProjects();
      }
      Pagination() {
        this.dataSourceTestCase.paginator = this.paginator;
        this.dataSourceTestCase.sort = this.sort;
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
          this.testCaseService.getTestCases(null,null,'',this.filterFormGroup.controls['testSuite'].value).subscribe(
            res => {
              console.log(res.result)
              this.listTestCase = res.result.map(
                (tCase) => {
                    const testCase = new TestCase();
                    testCase.id = tCase.id,
                    testCase.title = tCase.title,
                    testCase.description = tCase.description,
                    testCase.priority = tCase.priority,
                    testCase.severity = tCase.severity,
                    testCase.testState = tCase.testState,
                    testCase.testSuite = tCase.testSuite,
                    testCase.createdAt = new Date(tCase.createdAt).toLocaleDateString(),
                    testCase.createdBy = tCase.createdBy;
                    return testCase;
                }
              )
              if(res.result.length == 0){
                Swal.fire(
                  {
                    title:'El Proyecto no Cuenta con Casos de Prueba',
                    showCloseButton:true,
                    icon:'info'
                  }
                );
            }  
            this.dataSourceTestCase = new MatTableDataSource(this.listTestCase);
            this.Pagination();
            }
          );
        }
      }
    
      filterTableTestCase(e:Event){
        const filterValue = (e.target as HTMLInputElement).value;
        this.dataSourceTestCase.filter = filterValue
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
      }

  }