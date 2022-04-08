import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BASE_URL } from '../common/urlConstants';
import { TestCaseExecutionResponse } from '../interfaces/testcase';
import {
  TestCaseResponse,
  TestCaseCreated,
  TestCaseCreatedResponse,
  SingleTestCaseResponse,
} from '../interfaces/testcase';

@Injectable({
  providedIn: 'root',
})
export class TestCaseService {
  private testCase = 'api/test-cases';
  constructor(private http: HttpClient) {}
  getTestCases(
    page: number,
    pageSize: number,
    search: string,
    testSuiteId: number
  ): Observable<TestCaseResponse> {
    return this.http.get<TestCaseResponse>(
      BASE_URL +
        this.testCase +
        `?page=${page}&pageSize=${pageSize}&search=${search}&testSuiteId=${testSuiteId}`
    );
  }

  createTestCase(
    title: string,
    description: string,
    priorityId: number,
    severityId: number,
    testSuiteId: number,
    userId: number
  ): Observable<TestCaseCreated> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http
      .post<TestCaseCreatedResponse>(
        BASE_URL + this.testCase,
        {
          testSuiteId,
          title,
          description,
          priorityId,
          severityId,
          userId,
        },
        httpOptions
      )
      .pipe(map(this.extractData), catchError(this.handleErrorObservable));
  }

  addExecutionTestCase(
    id: number,
    xml: string,
    comments: string
  ): Observable<TestCaseExecutionResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/xml',
      }),
    };
    return this.http.post<TestCaseExecutionResponse>(
      BASE_URL + this.testCase + `/${id}/test-executions?comments=${comments}`,
      xml,
      httpOptions
    );
  }

  getTestCase(id: number): Observable<SingleTestCaseResponse> {
    return this.http.get<SingleTestCaseResponse>(
      BASE_URL + this.testCase + `/${id}`
    );
  }

  updateTestCase(
    title: string,
    description: string,
    testSuiteId: number,
    id: number,
    priorityId: number,
    severityId: number,
    userId: number
  ): Observable<TestCaseCreated> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http
      .put<TestCaseCreatedResponse>(
        BASE_URL + this.testCase + `/${id}`,
        {
          title,
          description,
          testSuiteId,
          priorityId,
          severityId,
          userId,
        },
        httpOptions
      )
      .pipe(map(this.extractData), catchError(this.handleErrorObservable));
  }

  getTestCaseLastExecution(id: number): Observable<TestCaseExecutionResponse> {
    return this.http.get<TestCaseExecutionResponse>(
      BASE_URL + this.testCase + `/${id}/last-execution`
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
