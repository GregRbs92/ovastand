import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { url_api } from '../../environments/environment';
import { LoginResponse } from '../interfaces/login-response';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  isLoggedIn() {
    let accessToken = localStorage.getItem('accessToken');
    let userId = localStorage.getItem('userId');
    if (!accessToken || !userId) {
      return false;
    }
    return this.http.get(`${url_api}/utilisateurs/${userId}?access_token=${accessToken}`)
      .map((response) => {
        if (response) {
          return true;
        }
        return false;
      })
      .catch((err: HttpErrorResponse) => {
        return Observable.throw(err.status);
      });
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<LoginResponse>(`${url_api}/utilisateurs/login`, { username: username, password: password })
      .map(res => {
        if (res) {
          localStorage.setItem('accessToken', res.id);
          localStorage.setItem('userId', res.userId.toString());
          return true;
        }
      })
      .catch((err: HttpErrorResponse) => { return Observable.throw(err.message) });
  }

  changePassword(oldPassword: string, newPassword: string) {
    let accessToken = localStorage.getItem('accessToken');
    return this.http.post(`${url_api}/utilisateurs/change-password?access_token=${accessToken}`, {oldPassword: oldPassword, newPassword: newPassword});
  }

}
