import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProjectService } from '../../services/projects.service';
import { PriorityService } from '../../services/priority.services';
import { SeverityService } from '../../services/seveities.services';
import { Filter } from 'src/app/interfaces/global.model';
import { TestCaseService } from '../../services/testcase.service';
import { SuitesService } from 'src/app/services/suites.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefectService } from 'src/app/services/defect.service';
import { UtilsService } from 'src/app/common/UtilsService';
import { DefectView } from 'src/app/interfaces/defect';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { SpinnerService } from 'src/app/common/spinner/spinner.service';
import { PlanService } from 'src/app/services/plan.service';

@Component({
  selector: 'app-gestion-defectos',
  templateUrl: './gestion-defectos.component.html',
  styleUrls: ['./gestion-defectos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GestionDefectosComponent implements OnInit {
  listProjects: Filter[] = [];
  listTestPlans: Filter[] = [];
  listDefectState: Filter[] = [{group:2,key:1,value:'Nuevo'},{group:2,key:2,value:'Aceptado'},
  {group:2,key:3,value:'Rechazado'},{group:2,key:4,value:'Corregido'},{group:2,key:5,value:'En Observacion'}];
  filterFormGroup: FormGroup;
  filterDefectsGroup: FormGroup;
  validateUpdateForm: FormGroup;
  isUpdateVisible = false;
  isVisible = false;
  isDetailVisible = false;
  submitted = false;
  isOkLoading = false;
  testCaseId: number;
  updated: boolean = false;

  page: number = 1;
  pageSize: number = 10;
  count: number = 0;

  id: number

  data: Array<{
    id: number;
    title: string;
    repro_steps: string;
    priority: string;
    severity: string;
    defectState: string;
    tag:string;
    testPlan:string;
    testSuite:string;
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
    testPlan:'',
    testSuite:'',
    testCase:'',
    tag: '',
    state: ''
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
  defectStates: Array<{
    label: string;
    value: number;
  }> = [{label:"Nuevo",value:1},
  {label:"Aceptado",value:2},
  {label:"Rechazado",value:3},
  {label:"Corregido",value:4},
  {label:"En Observacion",value:5}];
  constructor(
    private ProjectService: ProjectService,
    private priorityService: PriorityService,
    private severityService: SeverityService,
    private testCaseService: TestCaseService,
    private suiteService: SuitesService,
    private defectService: DefectService,
    private _fb: FormBuilder,
    private utils: UtilsService,
    private _sanitizer: DomSanitizer,
    private iconRegistry: MatIconRegistry,
    private spinnerService: SpinnerService,
    private testPlanService: PlanService
  ) {
    this.iconRegistry.addSvgIcon(
      'BugIcon',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/bug.svg')
    );
   }

  ngOnInit(): void {
    this.getProjects();
    this.getPriorities();
    this.getSeverities();
    this.filterFormGroup = this._fb.group({
      projects: ['', [Validators.required]],
      testPlans: ['']
    });
    this.filterDefectsGroup = this._fb.group({
      projects: ['', [Validators.required]],
      stateDefect: ['']
    });
    this.validateUpdateForm = this._fb.group({
      selectPriority: [null, [Validators.required]],
      selectSeverity: [null, [Validators.required]],
      updateState: [null,[Validators.required]]
    });
  }

  search() {
    var defects;
    if(this.filterDefectsGroup.controls['stateDefect'].value){
      defects = this.filterDefectsGroup.controls['stateDefect'].value;
      defects.join();
      console.log(defects);
    }else{
      defects = '1,2,3,4,5';
    }

    if (!this.filterDefectsGroup.invalid) {
      this.defectService
        .getDefectbyProject(
          this.page,
          this.pageSize,
          '',
          this.filterDefectsGroup.controls['projects'].value,
          defects,
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
              tag: defect.tag,
              testPlan: defect.testCase.testSuite.testPlan?.title,
              testSuite: defect.testCase.testSuite.title
            };
          });
          this.page = res.page;
          this.pageSize = res.pageSize;
          this.count = res.count;
        });
    }
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


  updateFilter(e: any) {
    if (e.source.ngControl.name == 'projects') {
      this.testPlanService.getTestPlansByProject(null, null, '', e.value)
        .subscribe((res) => {
          console.log(res);
          this.listTestPlans = res.result.map((testPlan) => {
            const filtTestSuite = new Filter();
            filtTestSuite.group = 1;
            filtTestSuite.key = testPlan.id;
            filtTestSuite.value = testPlan.title;
            return filtTestSuite;
          });
        });
    }
  }

  validacionesDefects(campo:string){
    return (
      this.filterDefectsGroup.get(campo).invalid &&
      this.filterDefectsGroup.get(campo).touched
    );
  }

  validaciones(campo: string): boolean {
    return (
      this.filterFormGroup.get(campo).invalid &&
      this.filterFormGroup.get(campo).touched
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

  showModal(): void {
    this.isVisible = true;
  }

  handleOkDetail(): void{
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
      this.isDetailVisible = false;
      this.isUpdateVisible = false;
    }, 3000);
  }
  handleCancelDetail(): void{
    this.defecto = {
      id: 0,
      title: '',
      repro_steps: '',
      severity: '',
      severityId: 0,
      severityIcon: '',
      priority: '',
      priorityId: 0,
      priorityIcon: '',
      testPlan:'',
      testSuite:'',
      testCase:'',
      tag: '',
      state: ''
    };
    this.isDetailVisible = false;
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
      this.filterFormGroup.controls['projects'].setValue(''),
        this.filterFormGroup.controls['testPlans'].setValue('')
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  generatePDF() {
    if (this.filterFormGroup.valid) {
      const navi = (window.navigator as any);
      let datePdf = new Date();
      this.defectService.getPdf(
        this.filterFormGroup.controls['projects'].value,
        this.filterFormGroup.controls['testPlans'].value ? this.filterFormGroup.controls['testPlans'].value : null
      )
        .subscribe(x => {
          var newBlob = new Blob([x], { type: "application/pdf" });

          if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
            (window.navigator as any).msSaveOrOpenBlob(newBlob, "defectos-" + this.utils.formatDate(datePdf));
            return;
          }

          const data = window.URL.createObjectURL(newBlob);

          var link = document.createElement('a');
          link.href = data;
          link.download = "defectos-" + this.utils.formatDate(datePdf);

          link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          this.isVisible = false;

          this.filterFormGroup.controls['projects'].setValue('');
          this.filterFormGroup.controls['testPlan'].setValue('')
          setTimeout(function () {
            window.URL.revokeObjectURL(data);
            link.remove();
          }.bind(this), 100);

        });
    } else {
      Object.values(this.filterFormGroup.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  onPageIndexChange(selectedPage: number){
    
  }

  fetchDefects(page: number, pageSize: number, search: string = '') {
    var defects;
    if(this.filterDefectsGroup.controls['stateDefect'].value){
      defects = this.filterDefectsGroup.controls['stateDefect'].value;
      defects.join();
      console.log(defects);
    }else{
      defects = '1,2,3,4';
      console.log(defects);
    }
    this.defectService
      .getDefectbyProject(page, pageSize, search,this.filterDefectsGroup.controls['projects'].value,defects,null)
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
            tag: defect.tag,
            testPlan: defect.testCase.testSuite.testPlan?.title,
            testSuite: defect.testCase.testSuite.title
          };
        });
        this.page = res.page;
        this.pageSize = res.pageSize;
        this.count = res.count;
      });
  }

  updateForm(): void {
    if (this.validateUpdateForm.valid) {
      if (this.id) {
        this.defectService
          .updateDefectState(
            this.validateUpdateForm.controls['selectSeverity'].value,
            this.validateUpdateForm.controls['selectPriority'].value,
            this.id,
            this.validateUpdateForm.controls['updateState'].value
          )
          .subscribe((defect) => {
            this.fetchDefects(this.page, this.pageSize);
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
            this.validateUpdateForm.controls['updateState'].setValue(0);
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
      console.log(res.result);
      this.validateUpdateForm
        .get('selectSeverity')
        .setValue(res.result.severity.id);
      this.validateUpdateForm
        .get('selectPriority')
        .setValue(res.result.priority.id);
      this.validateUpdateForm
        .get('updateState')
        .setValue(res.result.defectState.id);
        
      this.isUpdateVisible = true;
    });
  }

  detailDefect(id: number) {
    this.spinnerService.isLoading.next(true);
    this.id = id;
    this.defectService.getDefect(id).subscribe((res) => {
      this.defecto.id = this.id;
      this.defecto.title = res.result.title;
      this.defecto.repro_steps = res.result.repro_steps;
      this.defecto.severity = res.result.severity.name;
      this.defecto.severityId = res.result.severity.id;
      this.defecto.testPlan = res.result.testCase.title;
      this.defecto.testSuite = res.result.testCase.testSuite.title;
      this.defecto.testCase = res.result.testCase.title;
      this.defecto.state = res.result.defectState.name;
      this.defecto.tag = res.result.tag;
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
}
