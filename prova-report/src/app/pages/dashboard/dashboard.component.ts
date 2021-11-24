import { Component, OnInit, ViewChild } from '@angular/core';
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

  hGutter = 16;
  vGutter = 16;
  count = 2;
  array = new Array(this.count);

  constructor() {
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
          name: 'Aprobada', //verde
          data: [44, 55, 41],
        },
        {
          name: 'Fallida', //Naranja
          data: [13, 23, 20],
        },
        {
          name: 'Interrumpida', //Rojo
          data: [11, 17, 15],
        },
        {
          name: 'Omitida', //Rojo
          data: [0, 1, 2],
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
          name: 'Website Blog',
          type: 'column',
          data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
        },
        {
          name: 'Social Media',
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
            text: 'Website Blog',
          },
        },
        {
          opposite: true,
          title: {
            text: 'Social Media',
          },
        },
      ],
    };

    this.donutOptions = {
      series: [44, 55, 13, 33],
      chart: {
        width: 380,
        type: 'donut',
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
      labels: ["Aprobadas", "Fallidas", "Interrumpidas", "Omitidas"]
    };
  }

  ngOnInit() {}
}
