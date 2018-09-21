import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private http: HttpClient, private auth:AuthService) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.isLoggedIn();
  }
}
