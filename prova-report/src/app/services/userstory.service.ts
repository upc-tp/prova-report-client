import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BASE_URL } from '../common/urlConstants';
import { SingleUserStoryResponse, UserStoryCreatedResponse, UserStoryCriteria, UserStoryCriteriaCreatedResponse, UserStoryResponse } from '../interfaces/userstory';

@Injectable({
  providedIn: 'root',
})
export class UserStoryService {
  private userStory = 'api/user-stories';
  constructor(private http: HttpClient) {}

  getUserStories(
    page: number, pageSize: number, sortOrder: string, projectId: number): Observable<UserStoryResponse> {
    return this.http.get<UserStoryResponse>(
      BASE_URL +
        this.userStory +
        `?page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}&projectId=${projectId}`
    );
  }

  createUserStory(name: string, description: string, projectId:number, userStoryCriterias: any): Observable<UserStoryCreatedResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<UserStoryCreatedResponse>(BASE_URL + this.userStory, {
      name,
      description,
      projectId,
      userStoryCriterias
    }, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleErrorObservable)
    );
  }

  getUserStory(id: number): Observable<SingleUserStoryResponse> {
    return this.http.get<SingleUserStoryResponse>(
      BASE_URL + this.userStory + `/${id}`
    );
  }
    
  updateUserStory(name: string, description: string, id: number): Observable<UserStoryCreatedResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.put<UserStoryCreatedResponse>(BASE_URL + this.userStory + `/${id}`, {
      name,
      description
    }, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleErrorObservable)
    );
  }

  updateUserStoryCriteria(description: string, id: number): Observable<UserStoryCriteriaCreatedResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.put<UserStoryCriteriaCreatedResponse>(BASE_URL + this.userStory + `/criteria/${id}`, {
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

