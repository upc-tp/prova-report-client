import { HttpClient, HttpHeaders } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { BASE_URL } from '../common/urlConstants';
import { map, catchError } from 'rxjs/operators';
import { PrioritiesResponse } from '../interfaces/priorities';
import {ResetPasswordResponse } from '../interfaces/profile.model';
import { User } from '../interfaces/users';

@Injectable({
  providedIn: 'root',
})
export class ProfilesService {
  private currentUserSubject: BehaviorSubject<User>;
  private priority = 'api/';
  constructor(private http: HttpClient) {}

  getDecodedToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (error) {
      return null;
    }
  }

  resetPassword(password: string, newPassword: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
   return this.http.put<ResetPasswordResponse>(
      BASE_URL + this.priority + `reset-password`,{
          password,
          newPassword
      },httpOptions).pipe(
          map(res => {
            const decoded = this.getDecodedToken(res.result.accessToken);
            console.log("Decoded Token =>", decoded);
            const user: User = {
              uid: decoded.uid,
              email: decoded.email,
              firstName: decoded.firstName,
              lastName: decoded.lastName,
              role: decoded.role,
              iat: decoded.iat,
              exp: decoded.exp,
              accessToken: res.result.accessToken,
              refreshToken: res.result.refreshToken
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }),
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
