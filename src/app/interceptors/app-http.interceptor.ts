import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {AuthService} from "../services/auth.service";

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(private authSevice : AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!request.url.includes("/auth/login")){
      let newrequest = request.clone({
        headers : request.headers.set('Authorization' , 'Bearer'+this.authSevice.accesToken )
      })
      return next.handle(newrequest).pipe(
        catchError(err => {
          if(err.status==401){
            this.authSevice.logout();
          }
          return throwError(err.message)
        })
      );
    } else return next.handle(request);

  }
}
