import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Project } from '../../../interfaces/projects';
import { TestCase } from '../models/TestCaseExecution.model';
import { Filter } from '../../../interfaces/global.model';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { SuitesService } from '../../../services/suites.service';
import { ProjectService } from '../../../services/projects.service';
import { TestCaseService } from '../../../services/testcase.service';

const NoTest = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 508 508" style="enable-background:new 0 0 508 508;" xml:space="preserve">
<circle style="fill:#4CDBC4;" cx="254" cy="254" r="254"/>
<polygon style="fill:#FFFFFF;" points="121.2,83.2 121.2,424.4 330.4,424.4 330.4,368.4 386.8,368.4 386.8,83.2 "/>
<polygon style="fill:#E6E9EE;" points="330.4,424.4 386.8,368.4 330.4,368.4 "/>
<rect x="152.8" y="111.6" style="fill:#FF7058;" width="39.6" height="39.6"/>
<rect x="152.8" y="166.8" style="fill:#4CDBC4;" width="39.6" height="39.6"/>
<rect x="152.8" y="221.6" style="fill:#324A5E;" width="39.6" height="39.6"/>
<rect x="152.8" y="276.8" style="fill:#84DBFF;" width="39.6" height="39.6"/>
<g>
<rect x="202.8" y="111.6" style="fill:#E6E9EE;" width="152.4" height="8.8"/>
<rect x="202.8" y="129.6" style="fill:#E6E9EE;" width="92.4" height="8.8"/>
<rect x="202.8" y="166.8" style="fill:#E6E9EE;" width="152.4" height="8.8"/>
<rect x="202.8" y="184.8" style="fill:#E6E9EE;" width="92.4" height="8.8"/>
<rect x="202.8" y="221.6" style="fill:#E6E9EE;" width="152.4" height="8.8"/>
<rect x="202.8" y="240" style="fill:#E6E9EE;" width="92.4" height="8.8"/>
<rect x="202.8" y="276.8" style="fill:#E6E9EE;" width="152.4" height="8.8"/>
<rect x="202.8" y="294.8" style="fill:#E6E9EE;" width="92.4" height="8.8"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>`;
@Component({
  selector: 'app-ejecucion-casos-pruebas',
  templateUrl: './ejecucion-casos-pruebas.component.html',
  styleUrls: ['./ejecucion-casos-pruebas.component.scss'],
})
export class EjecucionCasosPruebasComponent implements OnInit {
  filterFormGroup: FormGroup;
  listProjects: Filter[] = [];
  listTestSuite: Filter[] = [];
  listTestCase: TestCase[] = [];
  dataSourceTestCase = new MatTableDataSource<TestCase>();
  constructor(private _fb: FormBuilder,
    private _sanitizer: DomSanitizer,
    private iconRegistry: MatIconRegistry,
    private suiteService:SuitesService,
    private ProjectService:ProjectService,
    private testCaseService:TestCaseService
    ) {
      this.iconRegistry.addSvgIconLiteral('NoTest',this._sanitizer.bypassSecurityTrustHtml(NoTest));
    }
  testCaseSelected: TestCase;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  headerColumn: string[] = [
    'title',
    'description',
    'state',
    'priority',
    'severity',
    'registerDate',
    'registerBy',
    'responsable'
  ];

  ngOnInit(): void {
    this.filterFormGroup = this._fb.group({
      projects: ['', [Validators.required]],
      testSuite: ['', [Validators.required]],
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
