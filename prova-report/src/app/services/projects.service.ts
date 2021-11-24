import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { BASE_URL } from '../common/urlConstants';
import { ProjectsResponse, ProjectCreatedResponse } from '../interfaces/projects';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private testProject = 'api/projects';
  constructor(private http: HttpClient) {}

  getTestProjects(search: string): Observable<ProjectsResponse> {
    return this.http.get<ProjectsResponse>(BASE_URL + this.testProject + `?search=${search}`);
  }

  createTestProject(title: string, description: string): Observable<ProjectCreatedResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<ProjectCreatedResponse>(BASE_URL + this.testProject, {
      title,
      description
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
