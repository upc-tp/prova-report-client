import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/common/UtilsService';
import { TestExecution, TestExecutionStep } from 'src/app/interfaces/test-executions';
import { TestExecutionService } from 'src/app/services/test-executions.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DefectService } from '../../services/defect.service';
import { PriorityService } from '../../services/priority.services';
import { SeverityService } from '../../services/seveities.services';

@Component({
  selector: 'app-detalle-ejecucion',
  templateUrl: './detalle-ejecucion.component.html',
  styleUrls: ['./detalle-ejecucion.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetalleEjecucionComponent implements OnInit {
  executionId: number;
  executionSelected: TestExecution;
  testExecutionSteps: TestExecutionStep[] = [];
  pageSteps: number = 1;
  pageSizeSteps: number = 10;
  countSteps: number = 0;
  submitted = false;
  validateAddForm!: FormGroup;
  priorities: Array<{
    label: string;
    value: number;
  }> = [];
  severities: Array<{
    label: string;
    value: number;
  }> = [];
  isOkLoading = false;
  
  isVisible = false;

  expandSet = new Set<number>();

  constructor(private route: ActivatedRoute, private router: Router, 
    private testExecutionService: TestExecutionService, public utils: UtilsService, 
    private iconRegistry: MatIconRegistry, private _sanitizer:DomSanitizer, private _fb: FormBuilder,
    private defectService: DefectService, private priorityService: PriorityService, private severityService: SeverityService
    ) { 
    this.iconRegistry.addSvgIcon(
      'NoTest',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/no-test.svg')
    );
    this.iconRegistry.addSvgIcon(
      'BugIcon',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/bug.svg')
    );

  }
  showModal() {
    this.isVisible = true;
  }
  ngOnInit(): void {
    this.getPriority();
    this.getSeverity();
    this.route.queryParams.subscribe(params => {
      this.executionId = Number(params.executionId);
    });
    this.validateAddForm = this._fb.group({
      title: [null, [Validators.required]],
      repro_steps: [null, [Validators.required]],
      selectSeverity: [null, [Validators.required]],
      selectPriority: [null, [Validators.required]],
    });
    this.getExecution();
  }
  getExecution() {
    this.testExecutionService.getTestExecution(this.executionId).subscribe((res) => {
      console.log(res);
      this.executionSelected = res.result;
      this.testExecutionSteps = this.executionSelected.testExecutionSteps.map(step => {
        return {
          ...step,
          expand: false
        }
      });
      console.log("Test execution steps:");
      console.log(this.testExecutionSteps);
      this.countSteps = this.testExecutionSteps.length;
    });
  }

  onPageIndexChangeSteps(selectedPage: number) {
    this.pageSteps = selectedPage;
    // this.getTestSteps();
  }
  get f() { return this.validateAddForm.controls; }
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  handleCancel(): void{
    this.isVisible = false;
    this.submitted = false;
  }
  submitForm(): void {
    this.submitted = true;
    if (this.validateAddForm.valid) {
      this.defectService
        .createDefect(
          this.validateAddForm.controls['title'].value,
          this.validateAddForm.controls['repro_steps'].value,
          parseInt(this.executionSelected.testCase.id.toString()),
          this.validateAddForm.controls['selectPriority'].value,
          this.validateAddForm.controls['selectSeverity'].value
        )
        .subscribe(
          (defecto) => {
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
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 3000);
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
  backtestCaseExecution() { }

}
