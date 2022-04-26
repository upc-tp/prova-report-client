import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { DefectData, DefectView } from 'src/app/interfaces/defect';
import { PriorityService } from 'src/app/services/priority.services';
import { SeverityService } from 'src/app/services/seveities.services';

@Component({
  selector: 'app-validacion-bugs',
  templateUrl: './validacion-bugs.component.html',
  styleUrls: ['./validacion-bugs.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ValidacionBugsComponent implements OnInit {
  isDetailVisible = false;
  isUpdateVisible = false;
  isVisible = false;
  isOkLoading = false;
  validateForm!: FormGroup;
  id: number;
  page: number = 1;
  pageSize: number = 10;
  saved: boolean = false;
  updated: boolean = false;
  count: number = 0;
  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 500;
  testCaseId: number;
  filterFormGroup: FormGroup;
  validateUpdateForm: FormGroup;
  listProjects: Filter[] = [];
  listTestSuite: Filter[] = [];
  listTestCase: Filter[] = [];
  listDefect: Defect[] = [];
  dataSourceDefect = new MatTableDataSource<Defect>();
  constructor(
    private _fb: FormBuilder,
    private _sanitizer: DomSanitizer,
    private iconRegistry: MatIconRegistry,
    private suiteService: SuitesService,
    private ProjectService: ProjectService,
    private testCaseService: TestCaseService,
    private defectService: DefectService,
    private priorityService: PriorityService,
    private severityService: SeverityService
  ) {
    this.iconRegistry.addSvgIcon(
      'BugIcon',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/bug.svg')
    );
  }
  defectSelected: Defect;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  data: Array<{
    id: number;
    title: string;
    repro_steps: string;
    priority: string;
    severity: string;
    defectState: string;
  }> = [];
  defecto: DefectView = {
    id: 0,
    title: '',
    repro_steps: '',
    severity: '',
    severityId: 0,
    severityIcon: '',
    priority: '',
    priorityId: 0,
    priorityIcon: '',
  };
  defects: Array<{
    id: number;
    title: string;
    repro_steps: string;
    priority: string;
    priorityIcon: string;
    severityIcon: string;
    severity: string;
  }> = [];
  priorities: Array<{
    label: string;
    value: number;
  }> = [];
  severities: Array<{
    label: string;
    value: number;
  }> = [];
  testCases: Array<{
    label: string;
    value: number;
  }> = [];

  ngOnInit(): void {
    this.filterFormGroup = this._fb.group({
      projects: ['', [Validators.required]],
    });
    this.getPriorities();
    this.getSeverities();
    this.getProjects();
    this.getTestCases();
    this.validateUpdateForm = this._fb.group({
      selectPriority: [null, [Validators.required]],
      selectSeverity: [null, [Validators.required]],
    });

    this.listOfData = new Array(100);
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

  getPriorities() {
    this.priorityService.getPriorities(null, null, '').subscribe(
      (res) =>
        (this.priorities = res.result.map((priority) => {
          return {
            label: priority.name,
            value: priority.id,
          };
        }))
    );
  }

  getSeverities() {
    this.severityService.getSeverities(null, null, '').subscribe(
      (res) =>
        (this.severities = res.result.map((severity) => {
          return {
            label: severity.name,
            value: severity.id,
          };
        }))
    );
  }

  getTestCases() {
    this.testCaseService.getTestCases(null, null, '', 1).subscribe((res) => {
      this.testCases = res.result.map((testCase) => {
        return {
          label: testCase.title,
          value: testCase.id,
        };
      });
    });
  }
  validaciones(campo: string): boolean {
    return (
      this.filterFormGroup.get(campo).invalid &&
      this.filterFormGroup.get(campo).touched
    );
  }

  search() {
    if (!this.filterFormGroup.invalid) {
      this.defectService
        .getDefectbyProject(
          this.page,
          this.pageSize,
          '',
          this.filterFormGroup.controls['projects'].value,
          1,
          null
        )
        .subscribe((res) => {
          this.data = res.result.map((defect) => {
            return {
              id: defect.id,
              title: defect.title,
              repro_steps: defect.repro_steps,
              priority: defect.priority.name,
              priorityIcon:
                defect.priority.name === 'Baja'
                  ? '/assets/images/low-priority.png'
                  : defect.priority.name === 'Media'
                  ? '/assets/images/middle-priority.png'
                  : '/assets/images/high-priority.png',
              severity: defect.severity.name,
              severityIcon:
                defect.severity.name === 'Trivial'
                  ? '/assets/images/trivial.png'
                  : defect.severity.name === 'Normal'
                  ? '/assets/images/normal.png'
                  : '/assets/images/critico.png',
              defectState: defect.defectState.name,
            };
          });
          this.page = res.page;
          this.pageSize = res.pageSize;
          this.count = res.count;
        });
    }
  }

  filterTableDefect(e: Event) {
    const filterValue = (e.target as HTMLInputElement).value;
    this.dataSourceDefect.filter = filterValue.trim().toLowerCase();
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
    if (e.source.ngControl.name == 'testSuite') {
      this.testCaseService
        .getTestCasesBySuite(null, null, '', e.value)
        .subscribe((res) => {
          console.log(res);
          this.listTestCase = res.result.map((testCase) => {
            const filtTestCase = new Filter();
            filtTestCase.group = 1;
            filtTestCase.key = testCase.id;
            filtTestCase.value = testCase.title;
            return filtTestCase;
          });
        });
    }
  }

  detailDefect(id: number) {
    this.id = id;
    this.defectService.getDefect(id).subscribe((res) => {
      this.defecto.id = this.id;
      this.defecto.title = res.result.title;
      this.defecto.repro_steps = res.result.repro_steps;
      this.defecto.severity = res.result.severity.name;
      this.defecto.severityId = res.result.severity.id;
      (this.defecto.severityIcon =
        res.result.severity.name === 'Trivial'
          ? '/assets/images/trivial.png'
          : res.result.severity.name === 'Normal'
          ? '/assets/images/normal.png'
          : '/assets/images/critico.png'),
        (this.defecto.priority = res.result.priority.name);
      this.defecto.priorityId = res.result.priority.id;
      this.defecto.priorityIcon =
        res.result.priority.name === 'Baja'
          ? '/assets/images/low-priority.png'
          : res.result.priority.name === 'Media'
          ? '/assets/images/middle-priority.png'
          : '/assets/images/high-priority.png';
    });
    this.isDetailVisible = true;
  }

  updateForm(): void {
    if (this.validateUpdateForm.valid) {
      if (this.id) {
        this.defectService
          .updateDefect(
            this.validateUpdateForm.controls['selectSeverity'].value,
            this.validateUpdateForm.controls['selectPriority'].value,
            this.id
          )
          .subscribe((defect) => {
            this.fetchDefects(this.page, this.pageSize);
            console.log('Response: ', defect);
            this.isUpdateVisible = false;
            this.id = null;
            this.updated = true;
            setTimeout(
              function () {
                this.updated = false;
                console.log('Updated: ', this.updated);
              }.bind(this),
              10000
            );
            this.validateUpdateForm.controls['selectSeverity'].setValue(0);
            this.validateUpdateForm.controls['selectPriority'].setValue(0);
          });
      } else {
        Object.values(this.validateUpdateForm.controls).forEach((control) => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    }
  }
  updateDefect(id: number) {
    this.id = id;
    this.defectService.getDefect(id).subscribe((res) => {
      this.validateUpdateForm
        .get('selectSeverity')
        .setValue(res.result.severity.id);
      this.validateUpdateForm
        .get('selectPriority')
        .setValue(res.result.priority.id);
      this.isUpdateVisible = true;
    });
  }

  fetchDefects(page: number, pageSize: number, search: string = '') {
    this.defectService
      .getDefects(page, pageSize, search, this.testCaseId)
      .subscribe((res) => {
        this.defects = res.result.map((bug) => {
          return {
            id: bug.id,
            title: bug.title,
            repro_steps: bug.repro_steps,
            priority: bug.priority.name,
            priorityIcon:
              bug.priority.name === 'Baja'
                ? '/assets/images/low-priority.png'
                : bug.priority.name === 'Media'
                ? '/assets/images/middle-priority.png'
                : '/assets/images/high-priority.png',
            severityIcon:
              bug.severity.name === 'Trivial'
                ? '/assets/images/trivial.png'
                : bug.severity.name === 'Normal'
                ? '/assets/images/normal.png'
                : '/assets/images/critico.png',
            severity: bug.severity.name,
          };
        });
      });
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
      this.isDetailVisible = false;
      this.isUpdateVisible = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isDetailVisible = false;
    this.isUpdateVisible = false;
    this.id = null;
  }

  inputChanged(event) {
    this.modelChanged.next(event.target.value);
  }

  ngOnDestroy(): void {
    
  }

  checked = false;
  loading = false;
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
    this.listOfCurrentPageData.forEach((item) =>
      this.updateCheckedSet(item.id, value)
    );
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly DefectData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every((item) =>
      this.setOfCheckedId.has(item.id)
    );
    this.indeterminate =
      this.listOfCurrentPageData.some((item) =>
        this.setOfCheckedId.has(item.id)
      ) && !this.checked;
  }
  validateDefect(state:number){
    console.log(this.setOfCheckedId);
    let Ids: Array<number> = new Array<number>();
    this.setOfCheckedId.forEach((ts)=>{
      console.log(ts)
      Ids.push(ts);
    });

    this.defectService.updateStateDefect(Ids,state).subscribe(
      (res) => {
        if(res.success === 'true'){
          this.handleCancel();
          this.search();
        }else{

        }

      }

    );
  }

}
