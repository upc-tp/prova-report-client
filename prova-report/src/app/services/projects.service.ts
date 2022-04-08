import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { BASE_URL } from '../common/urlConstants';
import { ProjectsResponse, ProjectCreatedResponse, SingleProjectResponse, CollaboratorsResponse, CollaboratorCreatedResponse } from '../interfaces/projects';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private testProject = 'api/projects';
  constructor(private http: HttpClient) {}

  getTestProjects(page: number, pageSize: number, search: string): Observable<ProjectsResponse> {
    return this.http.get<ProjectsResponse>(BASE_URL + this.testProject + `?page=${page}&pageSize=${pageSize}&search=${search}`);
  }

  getTestProject(id: number): Observable<SingleProjectResponse> {
    return this.http.get<SingleProjectResponse>(BASE_URL + this.testProject + `/${id}`)
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

  updateTestProject(title: string, description: string, id: number): Observable<ProjectCreatedResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.put<ProjectCreatedResponse>(BASE_URL + this.testProject + `/${id}`, {
      title,
      description
    }, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleErrorObservable)
    );
  }

  getCollaborators(page: number, pageSize: number, search: string, id: number): Observable<CollaboratorsResponse> {
    return this.http.get<CollaboratorsResponse>(BASE_URL + this.testProject + `/${id}` + '/collaborators' + `?page=${page}&pageSize=${pageSize}&search=${search}`);
  }

  createCollaborator(firstName: string, lastName: string, email: string, role: string, password: string, id: number): Observable<CollaboratorCreatedResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<CollaboratorCreatedResponse>(BASE_URL+this.testProject+`/${id}`+'/collaborators', {
      firstName,
      lastName,
      email,
      role,
      password
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
