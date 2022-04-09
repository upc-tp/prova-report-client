import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/common/UtilsService';
import { TestCaseView, TestExecution } from 'src/app/interfaces/testcase';
import { TestCaseService } from 'src/app/services/testcase.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-detalles-ejecucion-caso-prueba',
  templateUrl: './detalles-ejecucion-caso-prueba.component.html',
  styleUrls: ['./detalles-ejecucion-caso-prueba.component.scss']
})
export class DetallesEjecucionCasoPruebaComponent implements OnInit {
  
  testCaseId: number;
  testCase: TestCaseView = {
    createdAt: '',
    description: '',
    title: '',
    id: 0,
    lastExecution: 0,
    userInCharge: ''
  };
  
  testExecutions: Array<{
    order:number;
    createdBy: string;
    comments: string;
    startTime: string;
    endTime: string;
    duration: any;
  }> = [];

  displayedColumns: string[] = ['order', 'createdBy', 'comments', 'startTime', 'endTime', 'duration'];
  dataSource = new MatTableDataSource<any>(); 
  
  constructor(private route: ActivatedRoute, private utils: UtilsService, private router: Router, private testCaseService: TestCaseService ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.testCaseId = params.testCaseId;
    });
    this.getTestCase();
    this.getTestExecutions();
  }

  getTestCase(){
    this.testCaseService.getTestCase(this.testCaseId).subscribe((res) => {
      this.testCase.createdAt = this.utils.formatDateTime(new Date(res.result.createdAt));
      this.testCase.description = res.result.description;
      this.testCase.title = res.result.title;
      this.testCase.id = res.result.id;
      this.testCase.lastExecution = res.result.lastExecution;
      this.testCase.userInCharge = res.result.userInCharge.firstName + ' ' +res.result.userInCharge.lastName;
    });
  }

  getTestExecutions(){
    this.testCaseService.getTestExecutions(null, null, '', this.testCaseId).subscribe( (res) => {
      this.testExecutions = res.result.map( (tExecution) => {
        return{
          order: tExecution.order,
          createdBy: tExecution.createdBy,
          startTime: tExecution.startTime = (tExecution.startTime == null) ? '-': this.utils.formatDateTime(new Date(tExecution.startTime)),
          endTime: tExecution.endTime = (tExecution.endTime == null) ? '-' : this.utils.formatDateTime(new Date(tExecution.endTime)),
          comments: tExecution.comments,
          duration: this.msToTime(tExecution.duration)
        };
      });
      console.log(this.testExecutions);
      this.dataSource = new MatTableDataSource(this.testExecutions);
      this.dataSource.paginator = this.paginator;
    });
  }

  backTestCaseExecution(){
    this.router.navigate(['ejecucion-casos-pruebas']);
  }


  msToTime(duration) {
    var milliseconds = Math.floor((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    var thours = (hours < 10) ? "0" + hours : hours,
    tminutes = (minutes < 10) ? "0" + minutes : minutes,
    tseconds = (seconds < 10) ? "0" + seconds : seconds;

    return thours + "h " + tminutes + "m " + tseconds + "s " + milliseconds + 'ms';
  }
}
