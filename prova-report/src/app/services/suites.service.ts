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

  getTestSuites(search: string): Observable<SuiteResponse> {
    return this.http.get<SuiteResponse>(BASE_URL + this.testSuite + `?search=${search}`)
  }

  getTestSuite(id: number): Observable<SingleSuiteResponse> {
    return this.http.get<SingleSuiteResponse>(BASE_URL + this.testSuite + `/${id}`)
  }

  createTestSuite(title: string, description: string): Observable<SuiteCreatedResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<SuiteCreatedResponse>(BASE_URL + this.testSuite, {
      title,
      description,
      projectId: 6,
    }, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleErrorObservable)
    );
  }

  updateTestSuite(title: string, description: string, id: number): Observable<SuiteCreatedResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.put<SuiteCreatedResponse>(BASE_URL + this.testSuite + `/${id}`, {
      title,
      description,
      projectId: 6,
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
