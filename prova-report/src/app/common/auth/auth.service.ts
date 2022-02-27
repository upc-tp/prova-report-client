import jwt_decode from 'jwt-decode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginResponse, RefreshResponse, User } from 'src/app/interfaces/users';
import { BASE_URL } from '../urlConstants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public logoutSubject: BehaviorSubject<boolean>;
  public currentUser: Observable<User>;
  private login_url = 'api/login';
  private logout_url = 'api/logout';
  private refresh_url = 'api/token';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    this.logoutSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  getDecodedToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (error) {
      return null;
    }
  }

  login(email, password) {
    return this.http.post<LoginResponse>(BASE_URL + this.login_url, { email, password }, this.httpOptions)
      .pipe(map(res => {
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
        return user;
      }));
  }

  logout() {
    const user = this.currentUserValue;
    return this.http.post<LoginResponse>(BASE_URL + this.logout_url, { refreshToken: user.refreshToken }, this.httpOptions).pipe(map(res => {
      console.log("Logout successfully");
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
      return res;
    }), catchError(this.handleErrorObservable));
  }

  refreshToken() {
    const user = this.currentUserValue;
    return this.http.post<RefreshResponse>(BASE_URL + this.refresh_url, { refreshToken: user.refreshToken }, this.httpOptions).pipe(map(res => {
      console.log("Refresh successfully");
      const decoded = this.getDecodedToken(res.accessToken);
      console.log("Decoded Token =>", decoded);
      const currentUser: User = {
        uid: decoded.uid,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        role: decoded.role,
        iat: decoded.iat,
        exp: decoded.exp,
        accessToken: res.accessToken,
        refreshToken: user.refreshToken
      };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      this.currentUserSubject.next(user);
      return res;
    }), catchError(this.handleErrorObservable));
  }

  private handleErrorObservable(error: any) {
    console.error(error.message || error);
    return throwError(error);
  }
}
