import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SuiteResponse, SuiteCreatedResponse, SingleSuiteResponse } from '../interfaces/suites';
import { BASE_URL } from '../common/urlConstants';

@Injectable({
  providedIn: 'root'
})
export class SuitesService {
  private testSuite = 'api/test-suites';
  constructor(private http: HttpClient) { }

  getTestSuites(page: number, pageSize: number, search: string): Observable<SuiteResponse> {
    return this.http.get<SuiteResponse>(BASE_URL + this.testSuite + `?page=${page}&pageSize=${pageSize}&search=${search}`);
  }

  getTestSuite(id: number): Observable<SingleSuiteResponse> {
    return this.http.get<SingleSuiteResponse>(BASE_URL + this.testSuite + `/${id}`)
  }

  createTestSuite(title: string, description: string, projectId:number): Observable<SuiteCreatedResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<SuiteCreatedResponse>(BASE_URL + this.testSuite, {
      title,
      description,
      projectId,
    }, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleErrorObservable)
    );
  }

  updateTestSuite(title: string, description: string,projectId:number ,id: number): Observable<SuiteCreatedResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.put<SuiteCreatedResponse>(BASE_URL + this.testSuite + `/${id}`, {
      title,
      description,
      projectId,
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
