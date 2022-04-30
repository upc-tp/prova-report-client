import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SuitesService } from 'src/app/services/suites.service';
import { ProjectService } from 'src/app/services/projects.service';
import { TestCaseService } from 'src/app/services/testcase.service';
import { DefectService } from 'src/app/services/defect.service';
import { PriorityService } from 'src/app/services/priority.services';
import { SeverityService } from 'src/app/services/seveities.services';
import { DefectData, DefectView } from 'src/app/interfaces/defect';
import { Filter } from 'src/app/interfaces/global.model';

@Component({
  selector: 'app-verificacion-defectos',
  templateUrl: './verificacion-defectos.component.html',
  styleUrls: ['./verificacion-defectos.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VerificacionDefectosComponent implements OnInit {
  isDetailVisible = false;
  isVisible = false;
  isUpdateVisible = false;
  isOkLoading = false;
  id: number;
  validateUpdateForm: FormGroup;
  listProjects: Filter[] = [];
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
  priorities: Array<{
    label: string;
    value: number;
  }> = [];
  severities: Array<{
    label: string;
    value: number;
  }> = [];
  filterFormGroup: FormGroup;

  page: number = 1;
  pageSize: number = 10;
  saved: boolean = false;
  updated: boolean = false;
  count: number = 0;
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
  data: Array<{
    id: number;
    title: string;
    repro_steps: string;
    priority: string;
    severity: string;
    defectState: string;
  }> = [];
  ngOnInit(): void {
    this.filterFormGroup = this._fb.group({
      projects: ['', [Validators.required]],
    });
    this.getPriorities();
    this.getSeverities();
    this.getProjects();
    this.validateUpdateForm = this._fb.group({
      selectPriority: [null, [Validators.required]],
      selectSeverity: [null, [Validators.required]],
    });
    this.listOfData = new Array(100);
  }
  search() {
    if (!this.filterFormGroup.invalid) {
      this.defectService
        .getDefectbyProject(
          this.page,
          this.pageSize,
          '',
          this.filterFormGroup.controls['projects'].value,
          2,
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
    console.log(this.data);
  }
  handleCancel(): void {
    this.isVisible = false;
    this.isDetailVisible = false;
    this.isUpdateVisible = false;
    this.id = null;
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
  validaciones(campo: string): boolean {
    return (
      this.filterFormGroup.get(campo).invalid &&
      this.filterFormGroup.get(campo).touched
    );
  }
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  checked = false;
  loading = false;
  indeterminate = false;
  listOfCurrentPageData: readonly DefectData[] = [];
  listOfData: readonly DefectData[] = [];
  setOfCheckedId = new Set<number>();

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
            this.search();
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

  validateDefect(state:number,isFixed:number){
    console.log(this.setOfCheckedId);
    let Ids: Array<number> = new Array<number>();
    this.setOfCheckedId.forEach((ts)=>{
      console.log(ts)
      Ids.push(ts);
    });

    this.defectService.updateStateDefect(Ids,state,isFixed).subscribe(
      (res) => {
        console.log(res);
        if(res.success === 'true'){
          this.search();
          this.handleCancel();
        }else{

        }
        this.search();
      }

    );
  }

  showModal(): void {
    this.isVisible = true;
  }
}
