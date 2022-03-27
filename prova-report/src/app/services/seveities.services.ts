import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { BASE_URL } from '../common/urlConstants';
import { map, catchError } from 'rxjs/operators';
import { PrioritiesResponse } from '../interfaces/priorities';
import { SeveritiesResponse } from '../interfaces/severities';

@Injectable({
  providedIn: 'root',
})
export class SeverityService {
  private priority = 'api/severities';
  constructor(private http: HttpClient) {}

  getSeverities(page: number, pageSize: number, search: string): Observable<SeveritiesResponse> {
    return this.http.get<SeveritiesResponse>(BASE_URL + this.priority + `?page=${page}&pageSize=${pageSize}&search=${search}`);
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
