import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { BASE_URL } from '../common/urlConstants';
import { DashboardResponse } from '../interfaces/dashboard';
import { PrioritiesResponse } from '../interfaces/priorities';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private dashboard = 'api/dashboard';
  constructor(private http: HttpClient) {}


  getDashboard(projectId: number): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(BASE_URL + this.dashboard + `?projectId=${projectId}`);
  }

  getDashboardFilter(projectId: number, startDate: string, endDate: string) : Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(BASE_URL + this.dashboard + `?projectId=${projectId}&startDate=${startDate}&endDate=${endDate}`);
  }


}