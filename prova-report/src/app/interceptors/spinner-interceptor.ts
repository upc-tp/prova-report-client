import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../common/auth/auth.service';
import { SpinnerService } from '../common/spinner/spinner.service';


@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];
  private message = '';
  private get = false;

  constructor(private spinnerService: SpinnerService, private authService: AuthService) { }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.spinnerService.isLoading.next(this.requests.length > 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.accessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.accessToken}`
        }
      });
    }

    if (req.method === 'GET') {
      this.get = true;
      return next.handle(req); //Si se comenta este return, el spinner funcionaria con el GET
    } else {
      this.get = false
    }
    switch (req.method) {
      case 'POST':
        this.message = 'Se ha registrado satisfactoriamente'
        break;
      case 'PUT':
        this.message = 'Se ha actualizado satisfactoriamente'
        break;
      case 'DELETE':
        this.message = 'Se ha eliminado satisfactoriamente'
        break;
      default:
        break;
    }
    this.requests.push(req);

    console.log("No of requests--->" + this.requests.length);
    this.spinnerService.isLoading.next(true);
    return new Observable(observer => {
      const subscription = next.handle(req)
        .subscribe(
          event => {
            if (event instanceof HttpResponse) {
              if (!this.get && event.body && event.body.message) {
                this.message = event.body.message;
                Swal.fire({
                  html: `<h1 style="font-size: 2rem;">${this.message}</h1>`,
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 1500
                });
              }
              this.removeRequest(req);
              observer.next(event);
            }
          },
          err => {
            this.removeRequest(req);
            Swal.fire({
              icon: 'error',
              html: `<p style="font-size: 1.7em;">${err.error.message}</p>`,
              confirmButtonText: "Aceptar",
              //text: error.message,
            })
            observer.error(err);
          },
          () => {
            this.removeRequest(req);
            observer.complete();
          });
      // remove request from queue when cancelled
      return () => {
        this.removeRequest(req);
        subscription.unsubscribe();
      };
    });
  }
}