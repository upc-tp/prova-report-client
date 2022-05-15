import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/common/UtilsService';
import { TestExecution, TestExecutionStep } from 'src/app/interfaces/test-executions';
import { TestExecutionService } from 'src/app/services/test-executions.service';

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

  expandSet = new Set<number>();

  constructor(private route: ActivatedRoute, private router: Router, private testExecutionService: TestExecutionService, public utils: UtilsService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.executionId = Number(params.executionId);
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

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  backtestCaseExecution() { }

}
