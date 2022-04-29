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
import {Dashboard} from 'src/app/interfaces/dashboard';
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
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  @ViewChild('stackedBarHorizontal') stackedBarHorizontal: ChartComponent;
  @ViewChild('stackedBarVertical') severityStackedBarVertical: ChartComponent;
  @ViewChild('lineColumn') lineColumn: ChartComponent;
  @ViewChild('donut') donut: ChartComponent;
  @ViewChild('priorityStackedBarVertical') priorityStackedBarVertical: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public severityStackedBarVerticalOptions: Partial<ChartOptions>;
  public severityDefectsStackedBarVerticalOptions: Partial<ChartOptions>;
  public donutOptions: Partial<ChartOptions>;
  public donutDefectsOptions: Partial<ChartOptions>;
  public donutDefectsCorrected: Partial<ChartOptions>;
  public donutDesignCoverage: Partial<ChartOptions>;
  public priorityStackedBarVerticalOptions: Partial<ChartOptions>;
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



  priorityFilter: Array<{
    states: number[];
  }> = [];

  severityDefectFilter: Array<number> = [];

  statusFilter: Array<number> = [];
  defectFilter: Array<number> = [];

  testsCoverageFilter: Array<number> = [];
  defectFixedFilter: Array<number> = [];


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
        text: 'Severidad por Defecto',
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
        text: 'Prioridad',
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
              }
            }
          }
        }
      }
    };

      this.donutDefectsOptions = {
      series: this.defectFilter,
      labels: ['Nuevos', 'Aceptados', 'Rechazados'],
      chart: {
        width: 380,
        type: 'donut'
      },
      title: {
        text: 'Indicador de defectos de las pruebas por Estado',
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
        colors: ['#20A0E2', '#48b337', '#f50000'],
    };

      this.donutDesignCoverage = {
      series: this.testsCoverageFilter,
      labels: ['Pruebas asignadas',
        'Pruebas No asignadas'],
      chart: {
        width: 380,
        type: 'donut'
      },
      title: {
        text: 'Cobertura de diseño de prueba ',
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
      labels: ['Corregidos', 'No Corregidos'],
      chart: {
        width: 380,
        type: 'donut'
      },
      title: {
        text: 'Procentaje de defectos corregido',
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

  }

  ngOnInit() {
    this.filterFormGroup = this._fb.group({
      projects: ['', [Validators.required]]
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
      // tslint:disable-next-line:max-line-length
      const FilterCoverage: Array<number> = [Number(res.result.testDesignCoverage.assigned_tests), Number(res.result.testDesignCoverage.total_tests - res.result.testDesignCoverage.assigned_tests)];
      // tslint:disable-next-line:max-line-length
      const FilterFixed: Array<number> = [Number(res.result.defectsFixed.fixed_defects), Number(res.result.defectsFixed.accepted_defects - res.result.defectsFixed.fixed_defects)];
      this.donutDesignCoverage.series = FilterCoverage;
      this.donutDefectsCorrected.series = FilterFixed;
      this.donutOptions.series = this.statusFilter;
      this.donutDefectsOptions.series = this.defectFilter;
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
    if (this.filterFormGroup.controls.projects.value){
      this.projectId = this.filterFormGroup.controls.projects.value;
      this.getDashboardData();
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
