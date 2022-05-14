import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/common/UtilsService';
import { TestExecution } from 'src/app/interfaces/test-executions';
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
  constructor(private route: ActivatedRoute, private router:Router, private testExecutionService: TestExecutionService, private utils: UtilsService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe( params =>{
        this.executionId = Number(params.executionId);
    });

  }
  getExecution(){
    this.testExecutionService.getTestExecution(this.executionId).subscribe((res) => {
        this.executionSelected.id = this.executionId;
        this.executionSelected.createdAt = this.utils.formatDate(new Date(res.result.createdAt));
        this.executionSelected.createdBy = this.utils.formatDate(new Date(res.result.createdBy));
        this.executionSelected.order = res.result.order;
        this.executionSelected.startTime = this.utils.formatDateTime(new Date(res.result.startTime));
        this.executionSelected.endTime = this.utils.formatDateTime(new Date(res.result.endTime));
        this.executionSelected.duration = this.utils.msToTime(Number(res.result.duration));
        this.executionSelected.comments = res.result.comments;
        this.executionSelected.testState = res.result.testState;
        this.executionSelected.testExecutionSteps = res.result.testExecutionSteps;
        this.executionSelected.testCase = res.result.testCase;
    });
  }
  backtestCaseExecution(){}

}
