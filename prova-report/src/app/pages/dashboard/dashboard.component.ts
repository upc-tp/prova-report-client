import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexPlotOptions,
  ApexStroke,
  ApexYAxis,
  ApexFill,
  ApexLegend,
  ApexDataLabels,
} from 'ng-apexcharts';
import {Dashboard, requirementsCoverage} from 'src/app/interfaces/dashboard';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ProjectService } from 'src/app/services/projects.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { executionTrend } from '../../interfaces/dashboard';

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  yaxis: ApexYAxis | any;
  fill: ApexFill;
  legend: ApexLegend;
  colors?: string[];
  dataLabels?: ApexDataLabels;
  labels?: string[];
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  @ViewChild('stackedBarHorizontal') stackedBarHorizontal: ChartComponent;
  @ViewChild('stackedBarVertical') severityStackedBarVertical: ChartComponent;
  @ViewChild('lineColumn') lineColumn: ChartComponent;
  @ViewChild('donut') donut: ChartComponent;
  @ViewChild('priorityStackedBarVertical') priorityStackedBarVertical: ChartComponent;
  @ViewChild('requirementsStakedBar') requirementsStackedBarHorizontal: ChartComponent;
  @ViewChild('testExecutionLineChart') testExecutionLineChart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public severityStackedBarVerticalOptions: Partial<ChartOptions>;
  public severityDefectsStackedBarVerticalOptions: Partial<ChartOptions>;
  public donutOptions: Partial<ChartOptions>;
  public donutDefectsOptions: Partial<ChartOptions>;
  public donutDefectsCorrected: Partial<ChartOptions>;
  public donutDesignCoverage: Partial<ChartOptions>;
  public donutTestCoverage: Partial<ChartOptions>;
  public priorityStackedBarVerticalOptions: Partial<ChartOptions>;
  public requirementsStackedBarHorizontalOptions: Partial<ChartOptions>;
  public testExecutionTrendOptions: Partial<ChartOptions>;
  filterFormGroup: FormGroup;


  hGutter = 16;
  vGutter = 16;
  count = 2;
  array = new Array(this.count);
  projectId: number;
  startDate: Date;
  endDate: Date;
  startDateFor: string;
  endDateFor: string;
  listProjects: Array<{
    id: number;
    name: string;
  }> = [];

  dashboardData: Dashboard;
  severityFilter: Array<{
    states: number[];
  }> = [];



  priorityFilter: Array<{
    states: number[];
  }> = [];

  severityDefectFilter: Array<number> = [];

  statusFilter: Array<number> = [];
  defectFilter: Array<number> = [];

  testsDesignCoverageFilter: Array<number> = [];
  testsCoverageFilter: Array<number> = [];
  defectFixedFilter: Array<number> = [];
  requirementsCoverage: requirementsCoverage;
  testExecutionTrend: executionTrend[];

  severityDefectStackedVerticalData = [];

  severityStackedVerticalData = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  priorityStackedVerticalData = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];


  constructor( private dashboardService: DashboardService, private _fb: FormBuilder, private projectService: ProjectService,
               private _sanitizer: DomSanitizer, private iconRegistry: MatIconRegistry
    ) {

      this.iconRegistry.addSvgIcon(
        'NoTest',
        this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/no-test.svg')
      );
      this.chartOptions = {
      series: [
        {
          name: 'My-series',
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
      },
      title: {
        text: 'My First Angular Chart',
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
        ],
      },
    };

      this.severityDefectsStackedBarVerticalOptions = {
      series: [
        {
          name: 'Defectos',
          data: this.severityDefectFilter,
        }
      ],
      chart: {
        height: 350,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      title: {
        text: 'Defectos por severidad',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 2,
        },
      },
      xaxis: {
        type: 'category',
        categories: ['Trivial', 'Normal', 'Crítico'],
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
      },
      colors: ['#48b337', '#f5a700', '#f50000'],
    };

      this.severityStackedBarVerticalOptions = {
      series: [
        {
          name: 'Superado', // Azul
          data: this.severityStackedVerticalData[0],
          color: '#48b337',
        },
        {
          name: 'Fallido', // Verde
          data: this.severityStackedVerticalData[1],
          color: '#f50000',
        },
        {
          name: 'Omitido', // Amarillo
          data: this.severityStackedVerticalData[2],
          color: '#f5a700',
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      title: {
        text: 'Pruebas por severidad',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 2,
        },
      },
      xaxis: {
        type: 'category',
        categories: ['Trivial', 'Normal', 'Crítico'],
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
      },
      colors: ['#48b337', '#f5a700', '#f50000'],
    };

      this.priorityStackedBarVerticalOptions = {
      series: [
        {
          name: 'Superado', // Azul
          data: this.priorityStackedVerticalData[0],
          color: '#48b337',
        },
        {
          name: 'Fallido', // Verde
          data: this.priorityStackedVerticalData[1],
          color: '#f50000',
        },
        {
          name: 'Omitido', // Amarillo
          data: this.priorityStackedVerticalData[2],
          color: '#f5a700',
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      title: {
        text: 'Pruebas por prioridad',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 2,
        },
      },
      xaxis: {
        type: 'category',
        categories: ['Baja', 'Media', 'Alta'],
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
      },
      colors: ['#48b337', '#f5a700', '#f50000'],
    };

      this.donutOptions = {
      series: this.statusFilter,
      labels: ['No ejecutadas', 'Superadas', 'Fallidas', 'Omitidas'],
      chart: {
        width: 380,
        type: 'donut'
      },
      title: {
        text: 'Pruebas por estado',
      },
      dataLabels: {
        enabled: true,
      },
      legend: {
        position: 'right',
        offsetY: 0,
        height: 230,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                color: '#000',
              }
            }
          }
        }
      }
    };

      this.donutDefectsOptions = {
      series: this.defectFilter,
      labels: ["Nuevos", "Aceptados", "Rechazados", "Corregidos" , "En Observacion"],
      chart: {
        width: 380,
        type: 'donut'
      },
      title: {
        text: 'Defectos por estado',
      },
      dataLabels: {
        enabled: true,
      },
      legend: {
        position: 'left',
        offsetY: 0,
        height: 230,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                color: '#000',
              }
            }
          }
        }
      },
        colors: ['#20A0E2', '#48b337', '#f50000','#FF5414','#FFE15D'],
    };

      this.donutDesignCoverage = {
      series: this.testsDesignCoverageFilter,
      labels: ['Pruebas asignadas',
        'Pruebas No asignadas'],
      chart: {
        width: 380,
        type: 'donut'
      },
      title: {
        text: 'Cobertura de diseño de pruebas',
      },
      dataLabels: {
        enabled: true,
      },
      legend: {
        position: 'right',
        offsetY: 0,
        height: 230,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                color: '#000',
              }
            }
          }
        }
      },
        colors: ['#48b337', '#f50000'],
    };

      this.donutDefectsCorrected = {
      series: this.defectFixedFilter,
      labels: ['Defectos corregidos', 'Defectos no corregidos'],
      chart: {
        width: 380,
        type: 'donut'
      },
      title: {
        text: 'Defectos corregidos',
      },
      dataLabels: {
        enabled: true,
      },
      legend: {
        position: 'right',
        offsetY: 0,
        height: 230,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                color: '#000',
              }
            }
          }
        }
      },
        colors: ['#48b337', '#f50000']
    };
   
    this.donutTestCoverage = {
      series: this.testsCoverageFilter,
      labels: ['Casos de prueba ejecutados',
        'Casos de prueba No ejecutados'],
      chart: {
        width: 500,
        type: 'donut'
      },
      title: {
        text: 'Cobertura de pruebas',
      },
      dataLabels: {
        enabled: true,
      },
      legend: {
        position: 'right',
        offsetY: 0,
        height: 230,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                color: '#000',
              }
            }
          }
        }
      },
        colors: ['#48b337', '#f50000'],
    };

    this.requirementsStackedBarHorizontalOptions = {
      series:[],
      chart:{
        type:"bar",
        height:350,
        stacked:true
      },
      plotOptions:{
        bar:{
          horizontal:true
        }
      },
      stroke: {
        width:1,
        colors:["#fff"]
      },
      title:{
        text: "Cobertura de Requisitos"
      },
      xaxis:{
        categories:['']
      },
      yaxis:{
        title:{
          text:undefined
        }
      },
      fill:{
        opacity: 1
      },
      legend: {
        position: "top",
        horizontalAlign:"left",
        offsetX:40
      }


    };

    this.testExecutionTrendOptions = {
      series: [
        {
          name:"Ejecuciones",
          data:[]
        }
      ],
      chart: {
        height:350,
        type: "line",
        zoom:{
          enabled:false
        },
      },
      dataLabels:{
        enabled:true
      },
      stroke:{
        curve:"smooth"
      },
      title:{
        text: "Tendencia de pruebas ejecutadas por día",
        align:"left"
      },
    };
  }

  ngOnInit() {
    let dateStart = new Date();
    dateStart.setMonth(dateStart.getMonth()-1);
    this.filterFormGroup = this._fb.group({
      projects: ['',[Validators.required]],
      startDate: [dateStart,[Validators.required]],
      endDate: [new Date(),[Validators.required]]
    });
    this.getProjects();
  }

  getDashboardData(){

    this.dashboardService.getDashboardFilter(this.projectId, this.startDateFor, this.endDateFor).subscribe( (res) => {
      this.severityFilter = res.result.testsBySeverity.map( (stat) => {
        return{
          states: stat.statuses.map((yes) => {
            return yes.num_tests;
          })
        };
      });
      this.priorityFilter = res.result.testsByPriority.map( (stat) => {

        return{
          states: stat.statuses.map((yes) => {
            return yes.num_tests;
          })
        };
      });
      this.statusFilter = res.result.testsByStatus.map( (stat) => {
        return Number(stat.num_tests);
      });

      this.defectFilter = res.result.defectsByStatus.map( (stat) => {
        return Number(stat.num_defects);
      });
      this.severityDefectFilter = res.result.defectsBySeverity.map( (stat) => {
        return Number(stat.num_defects);
      });

      this.requirementsCoverage = res.result.requirementCoverage;
      this.testExecutionTrend = res.result.testExecutionTrend;
      console.log(this.testExecutionTrend);
      console.log(this.requirementsCoverage.categories)
      // tslint:disable-next-line:max-line-length
      const FilterCoverage: Array<number> = [Number(res.result.testDesignCoverage.assigned_tests), Number(res.result.testDesignCoverage.total_tests - res.result.testDesignCoverage.assigned_tests)];
      // tslint:disable-next-line:max-line-length
      const FilterFixed: Array<number> = [Number(res.result.defectsFixed.fixed_defects), Number(res.result.defectsFixed.accepted_defects - res.result.defectsFixed.fixed_defects)];

      const FilterCoverageTests: Array<number> = [Number(res.result.testCoverage.executed_tests), Number(res.result.testCoverage.total_tests - res.result.testCoverage.executed_tests)];
      this.donutDesignCoverage.series = FilterCoverage;
      this.donutDefectsCorrected.series = FilterFixed;
      this.donutTestCoverage.series = FilterCoverageTests;
      this.donutOptions.series = this.statusFilter;
      this.donutDefectsOptions.series = this.defectFilter;
      this.requirementsStackedBarHorizontalOptions.series = this.requirementsCoverage.series;
      this.requirementsStackedBarHorizontalOptions = { ...this.requirementsStackedBarHorizontalOptions,...{
        xaxis: {
          categories:this.requirementsCoverage.categories}
      }};
      console.log(this.testExecutionTrend.map(x => x.tests_executed_by_day))
      this.testExecutionTrendOptions = {
        ...this.testExecutionTrendOptions,...{
          series:[
            {
              name:"Ejecuciones",
              data:this.testExecutionTrend.map(x => x.tests_executed_by_day)
            }
          ],
          xaxis:{
            categories:this.testExecutionTrend.map(x => x.day)
          }
        }
      }
      this.priorityLoadDateStackecVerticalBars();
      this.severityLoadDateStackecVerticalBars();
      this.severityDefectsLoadDateStackecVerticalBars();
    });

  }

  severityDefectsLoadDateStackecVerticalBars(){
    this.severityDefectsStackedBarVerticalOptions.series = [
      {
        data: this.severityDefectFilter,
        colors: ['#48b337', '#f5a700', '#f50000'],
      },
    ];
  }

  priorityLoadDateStackecVerticalBars(){
    for (let i = 0; i < 3; i++){
      for (let j = 1; j < 4; j++){
        this.priorityStackedVerticalData[j - 1][i] = this.priorityFilter[i].states[j];
      }
    }
    this.priorityStackedBarVerticalOptions.series = [
        {
          name: 'Superado',
          data: this.priorityStackedVerticalData[0],
          color: '#48b337',
        },
        {
          name: 'Fallido',
          data: this.priorityStackedVerticalData[1],
          color: '#f50000',
        },
        {
          name: 'Omitido',
          data: this.priorityStackedVerticalData[2],
          color: '#f5a700',
        },
      ];
  }

  severityLoadDateStackecVerticalBars(){
    for (let i = 0; i < 3; i++){
      for (let j = 1; j < 4; j++){
        this.severityStackedVerticalData[j - 1][i] = this.severityFilter[i].states[j];
      }
    }
    for (let i = 0; i < 3; i++){
      for (let j = 1; j < 4; j++){
        this.priorityStackedVerticalData[j - 1][i] = this.priorityFilter[i].states[j];
      }
    }
    this.severityStackedBarVerticalOptions.series = [
        {
          name: 'Superado',
          data: this.severityStackedVerticalData[0],
          color: '#48b337',
        },
        {
          name: 'Fallido',
          data: this.severityStackedVerticalData[1],
          color: '#f50000',
        },
        {
          name: 'Omitido',
          data: this.severityStackedVerticalData[2],
          color: '#f5a700',
        },
      ];
  }

  getProjects() {
    this.projectService.getTestProjects(null, null, '').subscribe(
      (res) =>
      (this.listProjects = res.result.map((project) => {
        return{
          id: project.id,
          name: project.title
        };
      }))
    );
  }

  selectProject(){
    if(this.filterFormGroup.controls['projects'].value){
      this.projectId = this.filterFormGroup.controls['projects'].value;
      this.startDate = this.filterFormGroup.controls['startDate'].value;
      this.endDate = this.filterFormGroup.controls['endDate'].value;
      this.startDateFor= formatDate(this.startDate,'yyy-MM-dd','en-US');
      this.endDateFor= formatDate(this.endDate,'yyy-MM-dd','en-US');
      this.getDashboardData();
      console.log(this.startDateFor);
      console.log(this.endDate);
    }else{
      Swal.fire(
        {
          title: 'Selecciona un proyecto',
          showCloseButton: true,
          icon: 'info'
        });
    }
  }

  validaciones(campo: string): boolean {
    return (
      this.filterFormGroup.get(campo).invalid &&
      this.filterFormGroup.get(campo).touched
    );
  }

}
