import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable, throwError} from "rxjs";
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient, 
    private router: Router,
    private authStateService: AuthStateService
  ) { }


  login(username: string, password: string) {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', username)
      .set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    this.http.post('http://localhost:8000/users/token', body.toString(), { headers })
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('access_token', res.access_token);
          // Notificar al servicio de estado sobre el login exitoso
          this.authStateService.onLoginSuccess(username);
          this.router.navigate(['andina']);
        },
        error: (err) => console.error('Error:', err)
      });

  }

  getUsers(): Observable<any> {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('No se encontró el token en localStorage');
      return throwError(() => new Error('Token no encontrado')); // Importa 'throwError' de rxjs
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get('http://localhost:8000/users/', { headers });
  }

  createUser(user : any){
      return this.http.post('http://localhost:8000/users', user);
  }


}
