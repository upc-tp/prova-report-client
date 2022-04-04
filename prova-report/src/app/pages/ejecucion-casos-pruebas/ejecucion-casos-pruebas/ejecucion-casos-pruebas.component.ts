import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Project } from '../../../interfaces/projects';
import { TestCase, TestCaseSteps } from '../models/TestCaseExecution.model';
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
const BugIcon = `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 432.458 432.458" style="enable-background:new 0 0 432.458 432.458;" xml:space="preserve">
<g id="XMLID_311_">
<path id="XMLID_835_" d="M322.743,106.629c-2.778-4.518-5.731-8.889-8.873-13.08c-25.777-34.375-60.453-53.307-97.641-53.307
 s-71.864,18.932-97.641,53.307c-3.143,4.191-6.095,8.562-8.874,13.08c20.061,31.973,60.275,53.85,106.514,53.85
 C262.469,160.479,302.683,138.602,322.743,106.629z"/>
<path id="XMLID_1453_" d="M417.458,201.755h-65.606c-0.808-12.567-2.625-24.87-5.406-36.742l51.575-51.576
 c5.858-5.858,5.858-15.355,0-21.213c-5.857-5.858-15.355-5.858-21.213,0l-25.966,25.966c-7.348,12.845-17.202,24.674-29.365,35.028
 c-24.637,20.972-56.246,33.718-90.248,36.621v202.376c31.443-4.39,60.365-22.55,82.641-52.255
 c3.907-5.21,7.536-10.687,10.881-16.395l52.058,52.058c2.929,2.929,6.768,4.393,10.607,4.393c3.838,0,7.678-1.465,10.606-4.393
 c5.858-5.858,5.858-15.355,0-21.213l-59.579-59.58c7.427-19.594,11.986-40.927,13.41-63.076h65.606c8.284,0,15-6.716,15-15
 C432.458,208.471,425.742,201.755,417.458,201.755z"/>
<path id="XMLID_1457_" d="M201.23,189.84c-34.003-2.903-65.612-15.649-90.249-36.621c-12.163-10.354-22.017-22.183-29.365-35.028
 L55.65,92.224c-5.858-5.858-15.356-5.858-21.213,0c-5.858,5.858-5.858,15.355,0,21.213l51.575,51.575
 c-2.78,11.873-4.598,24.175-5.406,36.742H15c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15h65.606
 c1.424,22.149,5.983,43.482,13.41,63.076l-59.579,59.579c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.858,15.355,5.858,21.213,0
 l52.058-52.058c3.345,5.708,6.974,11.185,10.881,16.395c22.274,29.705,51.197,47.866,82.641,52.255V189.84z"/>
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
  encapsulation: ViewEncapsulation.None,
})
export class EjecucionCasosPruebasComponent implements OnInit {
  filterFormGroup: FormGroup;
  listProjects: Filter[] = [];
  listTestSuite: Filter[] = [];
  listTestCase: TestCase[] = [];
  listTestCaseSteps: TestCaseSteps[] = [];
  file:any;
  xmlData: string[] = [];
  formulario: FormGroup;
  dataSourceTestSteps = new MatTableDataSource<TestCaseSteps>();
  dataSourceTestCase = new MatTableDataSource<TestCase>();
  constructor(
    private _fb: FormBuilder,
    private _sanitizer: DomSanitizer,
    private iconRegistry: MatIconRegistry,
    private suiteService: SuitesService,
    private ProjectService: ProjectService,
    private testCaseService: TestCaseService
  ) {
    this.iconRegistry.addSvgIconLiteral(
      'NoTest',
      this._sanitizer.bypassSecurityTrustHtml(NoTest)
    );
    this.iconRegistry.addSvgIconLiteral(
      'BugIcon',
      this._sanitizer.bypassSecurityTrustHtml(BugIcon)
    );
    this.crearFormulario();
  }
  testCaseSelected: TestCase;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatorTestCase: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  nivelPositionTest = 0;

  headerColumn: string[] = [
    'title',
    'description',
    'state',
    'priority',
    'severity',
    'registerDate',
    'responsable',
  ];

  headerColumnTestCaseSteps: string[] = [
    'name',
    'executed_by',
    'start_time',
    'end_time',
    'duration'
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
  PaginationTestCase(){
    this.dataSourceTestSteps.paginator = this.paginatorTestCase;
  }
  getProjects() {
    this.ProjectService.getTestProjects(null, null, '').subscribe(
      (res) =>
        (this.listProjects = res.result.map((project) => {
          const filtProject = new Filter();
          filtProject.group = 0;
          filtProject.key = project.id;
          filtProject.value = project.title;
          return filtProject;
        }))
    );
  }

  enterTestCase(element: any) {
    this.nivelPositionTest++;
    this.testCaseSelected = element;
    if(this.testCaseSelected.lastExecution>0){
      this.getTestSteps();
    }else{
      Swal.fire({
        title: 'El Proyecto no Cuenta con Pasos de Ejecución',
        showCloseButton: true,
        icon: 'info',
      });
    }
    // this.PaginationTestCase();
    console.log(this.testCaseSelected);
  }

  validaciones(campo: string): boolean {
    return (
      this.filterFormGroup.get(campo).invalid &&
      this.filterFormGroup.get(campo).touched
    );
  }

  search() {
    if (!this.filterFormGroup.invalid) {
      this.testCaseService
        .getTestCases(
          null,
          null,
          '',
          this.filterFormGroup.controls['testSuite'].value
        )
        .subscribe((res) => {
          console.log(res.result);
          this.listTestCase = res.result.map((tCase) => {
            const testCase = new TestCase();
            (testCase.id = tCase.id),
              (testCase.title = tCase.title),
              (testCase.description = tCase.description),
              (testCase.priority = tCase.priority),
              (testCase.severity = tCase.severity),
              (testCase.testState = tCase.testState),
              (testCase.testSuite = tCase.testSuite),
              (testCase.lastExecution = tCase.lastExecution),
              (testCase.userInCharge = tCase.userInCharge);
            (testCase.createdAt = new Date(
              tCase.createdAt
            ).toLocaleDateString()),
              (testCase.createdBy = tCase.createdBy);
            return testCase;
          });
          if (res.result.length == 0) {
            Swal.fire({
              title: 'El Proyecto no Cuenta con Casos de Prueba',
              showCloseButton: true,
              icon: 'info',
            });
          }
          this.dataSourceTestCase = new MatTableDataSource(this.listTestCase);
          this.Pagination();
        });
    }
  }

  filterTableTestCase(e: Event) {
    const filterValue = (e.target as HTMLInputElement).value;
    this.dataSourceTestCase.filter = filterValue.trim().toLowerCase();
  }

  updateFilter(e: any) {
    if (e.source.ngControl.name == 'projects') {
      this.suiteService
        .getTestSuitesByProject(null, null, '', e.value)
        .subscribe((res) => {
          console.log(res);
          this.listTestSuite = res.result.map((testSuite) => {
            const filtTestSuite = new Filter();
            filtTestSuite.group = 1;
            filtTestSuite.key = testSuite.id;
            filtTestSuite.value = testSuite.title;
            return filtTestSuite;
          });
        });
    }
  }

  crearFormulario() {
    this.formulario = this._fb.group({
      commentary: [''],
    });
  }

  enviarEjecucion() {
    console.log(this.xmlData[0]);
    if(this.file){
      this.testCaseService.addExecutionTestCase(this.testCaseSelected.id,this.xmlData[0],this.formulario.controls['commentary'].value).subscribe(
        (res)=>{
          console.log(res.result);
        }
      );

    }
  }

  getTestSteps(){
    this.testCaseService.getTestCaseLastExecution(this.testCaseSelected.id).subscribe(
      (res) => {
        this.listTestCaseSteps = res.result.testExecutionSteps.map((tCaseStep) =>{
            const testCaseStep = new TestCaseSteps();
            testCaseStep.id = tCaseStep.id;
            testCaseStep.name = tCaseStep.name;
            testCaseStep.start_time = tCaseStep.startTime;
            testCaseStep.end_time = tCaseStep.endTime;
            testCaseStep.duration = tCaseStep.duration;
            testCaseStep.created_at = tCaseStep.createdAt;
            testCaseStep.created_by = tCaseStep.createdBy;
            return testCaseStep;
        }
        )
        this.dataSourceTestSteps = new MatTableDataSource(this.listTestCaseSteps);
        // this.PaginationTestCase();
      }
    );
  }
  fileChanged(e){
    this.file = e.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsText(this.file);
    fileReader.onload = (e) => {
        if(e.target.readyState == FileReader.DONE){
          let xmlData = e.target.result as string;
          this.xmlData.push(xmlData);
        }
    }
  }

  backtestCase(){
    this.nivelPositionTest--;
    this.testCaseSelected = null;
    this.listTestCaseSteps = [];
    this.Pagination();
    // this.PaginationTestCase();
  }
  deleteFile(){
    this.file = null;
    this.xmlData = null;
  }


}
