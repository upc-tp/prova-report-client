import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/projects.service';
import { PriorityService } from '../../services/priority.services';
import { SeverityService } from '../../services/seveities.services';
import { Filter } from 'src/app/interfaces/global.model';
import { TestCaseService } from '../../services/testcase.service';
import { SuitesService } from 'src/app/services/suites.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefectService } from 'src/app/services/defect.service';
import { UtilsService } from 'src/app/common/UtilsService';

@Component({
  selector: 'app-gestion-defectos',
  templateUrl: './gestion-defectos.component.html',
  styleUrls: ['./gestion-defectos.component.scss']
})
export class GestionDefectosComponent implements OnInit {
  listProjects: Filter[] = [];
  listTestSuite: Filter[] = [];
  filterFormGroup: FormGroup;

  isVisible = false;
  submitted = false;
  isOkLoading = false;

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
  constructor(
    private ProjectService: ProjectService,
    private priorityService: PriorityService,
    private severityService: SeverityService,
    private testCaseService: TestCaseService,
    private suiteService: SuitesService,
    private defectService: DefectService,
    private _fb: FormBuilder,
    private utils: UtilsService
  ) { }

  ngOnInit(): void {
    this.getProjects();
    this.getPriorities();
    this.getSeverities();
    this.filterFormGroup = this._fb.group({
      projects: ['', [Validators.required]],
      testSuite: ['', [Validators.required]]
    });
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

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
      this.filterFormGroup.controls['projects'].setValue(''),
        this.filterFormGroup.controls['testSuite'].setValue('')
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.filterFormGroup.controls['projects'].setValue('');
    this.filterFormGroup.controls['testSuite'].setValue('')
  }



  generatePDF() {
    if (this.filterFormGroup.valid) {
      const navi = (window.navigator as any);
      let datePdf = new Date();
      this.defectService.getPdf(
        this.filterFormGroup.controls['projects'].value,
        this.filterFormGroup.controls['testSuite'].value
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
          this.filterFormGroup.controls['testSuite'].setValue('')
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

}
