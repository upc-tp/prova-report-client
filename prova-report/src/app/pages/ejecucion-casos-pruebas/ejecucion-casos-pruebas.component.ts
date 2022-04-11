import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from 'src/app/common/spinner/spinner.service';
import { ThrowStmt } from '@angular/compiler';
import { DefectService } from 'src/app/services/defect.service';
import { SeverityService } from 'src/app/services/seveities.services';
import { PriorityService } from 'src/app/services/priority.services';

@Component({
  selector: 'app-ejecucion-casos-pruebas',
  templateUrl: './ejecucion-casos-pruebas.component.html',
  styleUrls: ['./ejecucion-casos-pruebas.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EjecucionCasosPruebasComponent implements OnInit, OnDestroy {
  filterFormGroup: FormGroup;
  isVisible = false;
  id: number;
  isOkLoading = false;
  validateAddForm!: FormGroup;
  page: number = 1;
  pageSize: number = 10;
  defects: Array<{
    title: string;
    repro_steps: string;
    testCaseId: number;
    severity: string;
    priority: string;
  }> = [];
  priorities: Array<{
    label: string;
    value: number;
  }> = [];
  severities: Array<{
    label: string;
    value: number;
  }> = [];
  listProjects: Filter[] = [];
  listTestSuite: Filter[] = [];
  listTestCase: TestCase[] = [];
  listTestCaseSteps: TestCaseSteps[] = [];
  file: any;
  xmlData: string[] = [];
  chargeTestSteps = 0;
  formulario: FormGroup;
  dataSourceTestSteps = new MatTableDataSource<TestCaseSteps>();
  dataSourceTestCase = new MatTableDataSource<TestCase>();
  filterItems: string[];
  actualFilterTestSuite: string;
  actualFilterProject: string;
  toExecutionPage: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _fb: FormBuilder,
    private _sanitizer: DomSanitizer,
    private iconRegistry: MatIconRegistry,
    private suiteService: SuitesService,
    private ProjectService: ProjectService,
    private testCaseService: TestCaseService,
    private spinnerService: SpinnerService,
    private defectService: DefectService,
    private priorityService: PriorityService, 
    private severityService: SeverityService,
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
    'opciones',
  ];

  headerColumnTestCaseSteps: string[] = [
    'name',
    'executed_by',
    'start_time',
    'end_time',
    'duration',
  ];

  ngOnInit(): void {
    this.getProjects();
    this.getPriority();
    this.getSeverity();
    console.log(localStorage.getItem('filterItems'));
    if (localStorage.getItem('filterItems')) {
      this.filterItems = JSON.parse(localStorage.getItem('filterItems'));
      this.filterFormGroup = this._fb.group({
        projects: [this.filterItems[1], [Validators.required]],
        testSuite: [this.filterItems[0], [Validators.required]],
      });
      this.search();
      this.filterFormGroup = this._fb.group({
        projects: ['', [Validators.required]],
        testSuite: ['', [Validators.required]],
      });
    } else {
      this.filterFormGroup = this._fb.group({
        projects: ['', [Validators.required]],
        testSuite: ['', [Validators.required]],
      });
      this.filterItems = [];
    }
    this.validateAddForm = this._fb.group({
      title: [null, [Validators.required]],
      repro_steps: [null, [Validators.required]],
      selectSeverity: [null, [Validators.required]],
      selectPriority: [null, [Validators.required]],
    });
    this.getDefects();
  }

  ngOnDestroy(): void {
    if (!this.toExecutionPage) localStorage.removeItem('filterItems');
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
    this.filterItems = [];
    localStorage.removeItem('filterItems');
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
            (testCase.createdAt = this.utils.formatDateTime(
              new Date(tCase.createdAt)
            )),
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
      this.actualFilterTestSuite =
        this.filterFormGroup.controls['testSuite'].value;
      this.actualFilterProject =
        this.filterFormGroup.controls['projects'].value;
      console.log(this.filterFormGroup.controls['testSuite'].value);
      console.log(this.filterFormGroup.controls['projects'].value);
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
      this.testCaseService
        .addExecutionTestCase(
          this.testCaseSelected.id,
          this.xmlData[0],
          this.formulario.controls['commentary'].value
        )
        .subscribe((res) => {
          console.log(res.result);
          this.getTestSteps();
        });
    } else {
      Swal.fire({
        title: 'Debes cargar un archivo para registrar la ejecución',
        showCloseButton: true,
        icon: 'info',
      });
    }
  }

  getTestSteps() {
    this.spinnerService.isLoading.next(true);
    this.testCaseService
      .getTestCaseLastExecution(this.testCaseSelected.id)
      .subscribe((res) => {
        this.listTestCaseSteps = res.result.testExecutionSteps.map(
          (tCaseStep) => {
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
        );
        this.dataSourceTestSteps = new MatTableDataSource(
          this.listTestCaseSteps
        );
        this.chargeTestSteps = 1;
        // this.PaginationTestCase();
      });
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
      console.log(this.xmlData);
    };
  }

  backtestCase() {
    this.nivelPositionTest--;
    this.testCaseSelected = null;
    this.listTestCaseSteps = [];
    this.dataSourceTestSteps = new MatTableDataSource(); 
    this.chargeTestSteps = 0;
    this.Pagination();
    // this.PaginationTestCase();
  }

  detailsExecutionTestCase(id: number) {
    this.addFilterItem(this.actualFilterTestSuite);
    this.addFilterItem(this.actualFilterProject);
    if (this.filterItems.length > 0) {
      localStorage.setItem('filterItems', JSON.stringify(this.filterItems));
    }
    this.toExecutionPage = true;
    this.router.navigate(['detalles-ejecucion-caso-prueba'], {
      queryParams: { testCaseId: id },
    });
  }

  addFilterItem(item: string) {
    if (!this.filterItems.includes(item)) {
      this.filterItems = [...this.filterItems, item];
    }
  }

  removeFilterItem(item: string) {
    if (this.filterItems.includes(item)) {
      this.filterItems = this.filterItems.filter(
        (currentItem) => currentItem !== item
      );
    }
  }

  deleteFile() {
    this.file = null;
    this.xmlData = [];
  }

  showModal(){
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.id = null;
  }
  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 3000);
  }

  submitForm(): void {
    if (this.validateAddForm.valid) {
      this.defectService
      .createDefect(
        this.validateAddForm.controls['title'].value,
        this.validateAddForm.controls['repro_steps'].value,
        parseInt(this.testCaseSelected.id.toString()),
        this.validateAddForm.controls['selectPriority'].value,
        this.validateAddForm.controls['selectSeverity'].value
      )
      .subscribe(
        (defecto) => {
          this.getDefects();
          console.log('Response: ', defecto);
          this.isVisible = false;
          this.validateAddForm.controls['title'].setValue('');
          this.validateAddForm.controls['repro_steps'].setValue('');
          this.validateAddForm.controls['selectPriority'].setValue(0);
          this.validateAddForm.controls['selectSeverity'].setValue(0);
        },
        (error) => console.log(error)
      );
  } else {
    Object.values(this.validateAddForm.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true});
      }
    });
    }
  }

  getDefects(){
    this.defectService.getDefects(null,null,'',this.testCaseSelected.id).subscribe(
      (res) => {
        this.defects = res.result.map((defectos) => {
          return {
            title: defectos.title,
            repro_steps: defectos.repro_steps,
            testCaseId: defectos.testCase.id,
            priority: defectos.priority.name,
            severity: defectos.severity.name,
          };
        })
      }
    )
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
    this.severityService.getSeverities(null, null, '').subscribe(
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
}
