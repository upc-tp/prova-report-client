import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PlanResponse, PlanCreatedResponse, SinglePlanResponse } from '../interfaces/plan';
import { BASE_URL } from '../common/urlConstants';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private testPlan = 'api/test-plans';
  constructor(private http: HttpClient) { }

  getTestPlans(page: number = null, pageSize: number = null, search: string = null): Observable<PlanResponse> {
    return this.http.get<PlanResponse>(BASE_URL + this.testPlan + `?page=${page}&pageSize=${pageSize}&search=${search}`);
  }
  getTestPlansByProject(page: number, pageSize: number, search: string, projectId:number): Observable<PlanResponse>{
    return this.http.get<PlanResponse>(BASE_URL + this.testPlan + `?page=${page}&pageSize=${pageSize}&search=${search}&projectId=${projectId}`);
  }

  getTestPlansForSelect(projectId: number) {
    return this.http.get<PlanResponse>(BASE_URL + this.testPlan + `?projectId=${projectId}`);
  }

  getTestPlan(id: number): Observable<SinglePlanResponse> {
    return this.http.get<SinglePlanResponse>(BASE_URL + this.testPlan + `/${id}`)
  }

  getReport(id:number){


  }

  createTestPlan(title: string, description: string, projectId:number, versionId: number): Observable<PlanCreatedResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<PlanCreatedResponse>(BASE_URL + this.testPlan, {
      title,
      description,
      projectId,
      versionId,
    }, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleErrorObservable)
    );
  }

  updateTestPlan(title: string, description: string,projectId:number ,versionId:number,id: number): Observable<PlanCreatedResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.put<PlanCreatedResponse>(BASE_URL + this.testPlan + `/${id}`, {
      title,
      description,
      projectId,
      versionId
    }, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleErrorObservable)
    );
  }
  
  private extractData(res: any) {
    let body = res;
    return body;
  }

  private handleErrorObservable(error: any) {
    console.error(error.message || error);
    return throwError(error);
  }
  private handleErrorPromise(error: Response | any) {
      console.error(error.message || error);
      return Promise.reject(error.message || error);
  }

}
