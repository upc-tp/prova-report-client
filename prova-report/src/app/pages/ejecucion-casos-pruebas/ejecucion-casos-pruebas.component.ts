import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { TestCase, TestCaseSteps } from './models/TestCaseExecution.model';
import { Filter } from '../../interfaces/global.model';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { SuitesService } from '../../services/suites.service';
import { ProjectService } from '../../services/projects.service';
import { TestCaseService } from '../../services/testcase.service';
import { UtilsService } from 'src/app/common/UtilsService';

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
  file: any;
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
    private testCaseService: TestCaseService,
    public utils: UtilsService
  ) {
    this.iconRegistry.addSvgIcon(
      'NoTest',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/no-test.svg')
    );
    this.iconRegistry.addSvgIcon(
      'BugIcon',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/bug.svg')
    );
    this.crearFormulario();
  }
  testCaseSelected: TestCase;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatorTestCase: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  nivelPositionTest = 0;

  headerColumn: string[] = [
    'id',
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
  PaginationTestCase() {
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
    if (this.testCaseSelected.lastExecution > 0) {
      this.getTestSteps();
    } else {
      // Swal.fire({
      //   title: 'El Proyecto no Cuenta con Pasos de Ejecución',
      //   showCloseButton: true,
      //   icon: 'info',
      // });
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
            (testCase.createdAt = this.utils.formatDateTime(new Date(
              tCase.createdAt
            ))),
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
    if (this.file) {
      this.testCaseService.addExecutionTestCase(this.testCaseSelected.id, this.xmlData[0], this.formulario.controls['commentary'].value).subscribe(
        (res) => {
          console.log(res.result);
        }
      );

    }
  }

  getTestSteps() {
    this.testCaseService.getTestCaseLastExecution(this.testCaseSelected.id).subscribe(
      (res) => {
        this.listTestCaseSteps = res.result.testExecutionSteps.map((tCaseStep) => {
          const testCaseStep = new TestCaseSteps();
          testCaseStep.id = tCaseStep.id;
          testCaseStep.name = tCaseStep.name;
          const startTime = new Date(tCaseStep.startTime);
          testCaseStep.start_time = this.utils.formatDateTime(startTime);
          const endTime = new Date(tCaseStep.endTime);
          testCaseStep.end_time = this.utils.formatDateTime(endTime);
          testCaseStep.duration = tCaseStep.duration;
          const createDate = new Date(tCaseStep.createdAt);
          testCaseStep.created_at = this.utils.formatDateTime(createDate);
          testCaseStep.created_by = tCaseStep.createdBy;
          return testCaseStep;
        }
        )
        this.dataSourceTestSteps = new MatTableDataSource(this.listTestCaseSteps);
        // this.PaginationTestCase();
      }
    );
  }
  fileChanged(e) {
    this.file = e.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsText(this.file);
    fileReader.onload = (e) => {
      if (e.target.readyState == FileReader.DONE) {
        let xmlData = e.target.result as string;
        this.xmlData.push(xmlData);
      }
    }
  }

  backtestCase() {
    this.nivelPositionTest--;
    this.testCaseSelected = null;
    this.listTestCaseSteps = [];
    this.Pagination();
    // this.PaginationTestCase();
  }
  deleteFile() {
    this.file = null;
    this.xmlData = null;
  }


}
