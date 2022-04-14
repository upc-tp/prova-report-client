import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Dashboard } from 'src/app/interfaces/dashboard';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ProjectService } from 'src/app/services/projects.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import Swal from 'sweetalert2';

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
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  @ViewChild('stackedBarHorizontal') stackedBarHorizontal: ChartComponent;
  @ViewChild('stackedBarVertical') stackedBarVertical: ChartComponent;
  @ViewChild('lineColumn') lineColumn: ChartComponent;
  @ViewChild('donut') donut: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public stackedBarHorizontalOptions: Partial<ChartOptions>;
  public stackedBarVerticalOptions: Partial<ChartOptions>;
  public lineColumnOptions: Partial<ChartOptions>;
  public donutOptions: Partial<ChartOptions>;
  filterFormGroup: FormGroup;


  hGutter = 16;
  vGutter = 16;
  count = 2;
  array = new Array(this.count);
  projectId: number;
  listProjects: Array<{
    id: number;
    name: string;
  }> = [];

  dashboardData: Dashboard;
  severityFilter: Array<{
    states: number[];
  }> = [];

  statusFilter: Array<number> = [];

  stackedVerticalData = [[0,0,0],[0,0,0],[0,0,0]];



  constructor( private dashboardService: DashboardService, private _fb: FormBuilder, private projectService: ProjectService,
    private _sanitizer: DomSanitizer,private iconRegistry:MatIconRegistry
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

    this.stackedBarHorizontalOptions = {
      series: [
        {
          name: 'Cancelado',
          data: [44, null, 41, 37, 22, 43, 21],
        },
        {
          name: 'Sin asignar',
          data: [53, 32, null, 52, null, 43, 32],
        },
        {
          name: 'En proceso',
          data: [12, 17, 11, null, 15, 11, 20],
        },
        {
          name: 'Solucionado',
          data: [9, 7, null, 8, null, 9, 4],
        },
        {
          name: 'Asignado',
          data: [25, null, 19, null, 25, 24, 10],
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
        stacked: true,
      },
      title: {
        text: 'Suites',
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      xaxis: {
        categories: [
          'ST01 Módulo de compras',
          'ST02 Módulo de ventas',
          'ST03 Pruebas de búsqueda',
          'ST01 Módulo de inventario',
        ],
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
      },
    };

    this.stackedBarVerticalOptions = {
      series: [
        {
          name: 'Superado', //Azul
          data: this.stackedVerticalData[0],
          color: '#48b337',
        },
        {
          name: 'Fallido', //Verde
          data: this.stackedVerticalData[1],
          color: '#f50000',
        },
        {
          name: 'Omitido', //Amarillo
          data: this.stackedVerticalData[2],
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
        text: 'Severidad',
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


    this.lineColumnOptions = {
      series: [
        {
          name: 'Pruebas ejecutadas',
          type: 'column',
          data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
        },
        {
          name: 'Tiempo (ms)',
          type: 'line',
          data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
      },
      stroke: {
        width: [0, 4],
      },
      title: {
        text: 'Duración',
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
      labels: [
        '01 Jan 2001',
        '02 Jan 2001',
        '03 Jan 2001',
        '04 Jan 2001',
        '05 Jan 2001',
        '06 Jan 2001',
        '07 Jan 2001',
        '08 Jan 2001',
        '09 Jan 2001',
        '10 Jan 2001',
        '11 Jan 2001',
        '12 Jan 2001',
      ],
      xaxis: {
        type: 'datetime',
      },
      yaxis: [
        {
          title: {
            text: 'Pruebas ejecutadas',
          },
        },
        {
          opposite: true,
          title: {
            text: 'Tiempo (ms)',
          },
        },
      ],
    };

    this.donutOptions = {
      series: this.statusFilter,
      labels: ["No ejecutadas", "Superadas", "Fallidas", "Omitidas"],
      chart: {
        width: 380,
        type: 'donut'
      },
      title: {
        text: 'Indicador de éxito de las pruebas',
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
                // formatter: function (w) {
                //   const total = w.globals.seriesTotals.reduce((a, b) => {
                //     return a + b
                //   }, 0);
                //   return `${total} pruebas`;
                // }
              }
            }
          }
        }
      }
    };

  }

  ngOnInit() {
    this.filterFormGroup = this._fb.group({
      projects: ['',[Validators.required]]
    });
    this.getProjects();
  }

  getDashboardData(){

    this.dashboardService.getDashboard(this.projectId).subscribe( (res) => {
      this.severityFilter = res.result.testsBySeverity.map( (stat) => {
        return{
          states: stat.statuses.map((yes) => {
            return yes.num_tests;
          })
        }
      });
      this.statusFilter = res.result.testsByStatus.map( (stat) => {
        return Number(stat.num_tests);
      });
      this.donutOptions.series = this.statusFilter;
      console.log(this.statusFilter);
      this.loadDateStackecVerticalBars();
    });

  }

  loadDateStackecVerticalBars(){
    for(var i = 0; i < 3; i++){
      for(var j = 1; j < 4; j++){
        this.stackedVerticalData[j-1][i] = this.severityFilter[i].states[j];
      }
    }
    this.stackedBarVerticalOptions.series = [
        {
          name: 'Superado',
          data: this.stackedVerticalData[0],
          color: '#48b337',
        },
        {
          name: 'Fallido',
          data: this.stackedVerticalData[1],
          color: '#f50000',
        },
        {
          name: 'Omitido',
          data: this.stackedVerticalData[2],
          color: '#f5a700',
        },
      ]
  }
  getProjects() {
    this.projectService.getTestProjects(null, null, '').subscribe(
      (res) =>
      (this.listProjects = res.result.map((project) => {
        return{
          id: project.id,
          name: project.title
        }
      }))
    );
  }
  selectProject(){
    if(this.filterFormGroup.controls['projects'].value){
      this.projectId = this.filterFormGroup.controls['projects'].value;
      this.getDashboardData();
    }else{
      Swal.fire(
        {
          title: 'Selecciona un proyecto',
          showCloseButton:true,
          icon:'info'
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
