import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {map, Observable, throwError} from "rxjs";
import {createAction} from "@ngrx/store";
import {act} from "@ngrx/effects";

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  constructor(private http: HttpClient , private router : Router) { }

  createAction(action :any): Observable<string[]> {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('No se encontró el token en localStorage');
      return throwError(() => new Error('Token no encontrado'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any[]>('http://localhost:8000/actions',action, { headers }).pipe(
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

    return this.http.get<any[]>('http://localhost:8000/actions', { headers }).pipe(
      map(actions => actions.map(action => action))
    );
  }




}
