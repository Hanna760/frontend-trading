import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {map, Observable, throwError} from "rxjs";
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  constructor(private readonly http: HttpClient , private readonly router : Router, private readonly configService: ConfigService) { }

  createAction(action :any): Observable<string[]> {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('No se encontró el token en localStorage');
      return throwError(() => new Error('Token no encontrado'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any[]>(`${this.configService.apiUrl}/actions`,action, { headers }).pipe(
      map(actions => actions.map(action => action.nombre))
    );
  }


  getAction(): Observable<string[]> {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('No se encontró el token en localStorage');
      return throwError(() => new Error('Token no encontrado'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.configService.apiUrl}/actions`, { headers }).pipe(
      map(actions => actions.map(action => action))
    );
  }




}
