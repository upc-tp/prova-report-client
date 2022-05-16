import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { BASE_URL } from '../common/urlConstants';
import { map, catchError } from 'rxjs/operators';
import { PrioritiesResponse } from '../interfaces/priorities';
import { VersionsCreatedResponse, VersionsResponse, DeleteVersionResponse } from '../interfaces/versions';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  private priority = 'api/versions';
  constructor(private http: HttpClient) {}

  createVersion(projectId: number, description: string, title: number): Observable<VersionsCreatedResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<VersionsCreatedResponse>(BASE_URL+this.priority, {
      projectId,
      description,
      title
    }, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleErrorObservable)
    );
  }

  getVersions(page: number, pageSize: number, projectId: number): Observable<VersionsResponse> {
    return this.http.get<VersionsResponse>(BASE_URL + this.priority + `?page=${page}&pageSize=${pageSize}&projectId=${projectId}`);
  }

  getVersionsForSelect(projectId: number) {
    return this.http.get<VersionsResponse>(BASE_URL + this.priority + `?projectId=${projectId}`);
  }

  deleteVersion(id:number): Observable<DeleteVersionResponse>{
    return this.http.delete<DeleteVersionResponse>(BASE_URL + this.priority + `/${id}`);
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
