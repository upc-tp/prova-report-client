import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { BASE_URL } from '../common/urlConstants';
import { map, catchError } from 'rxjs/operators';
import { PrioritiesResponse } from '../interfaces/priorities';

@Injectable({
  providedIn: 'root',
})
export class PriorityService {
  private priority = 'api/priorities';
  constructor(private http: HttpClient) {}

  getPriorities(page: number, pageSize: number, search: string): Observable<PrioritiesResponse> {
    return this.http.get<PrioritiesResponse>(BASE_URL + this.priority + `?page=${page}&pageSize=${pageSize}&search=${search}`);
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
