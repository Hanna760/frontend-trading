import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {catchError, map, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  constructor(private http: HttpClient , private router : Router) { }

  getUsers(): Observable<any> {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('No se encontró el token en localStorage');
      return throwError(() => new Error('Token no encontrado')); // Importa 'throwError' de rxjs
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get('http://localhost:8000/companies', { headers });
  }

  getCompanyNames(): Observable<string[]> {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('No se encontró el token en localStorage');
      return throwError(() => new Error('Token no encontrado'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>('http://localhost:8000/companies', { headers }).pipe(
      map(companies => companies.map(company => company.nombre))
    );
  }

  getCompanyIdByName(nombre: string): Observable<number | null> {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('No se encontró el token en localStorage');
      return throwError(() => new Error('Token no encontrado'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>('http://localhost:8000/companies', { headers }).pipe(
      map((companies) => {
        const company = companies.find(c => c.nombre.toLowerCase() === nombre.toLowerCase());
        return company ? company.id : null;
      }),
      catchError((error) => {
        console.error('Error al buscar el ID de la empresa:', error);
        return throwError(() => new Error('Error al obtener el ID de la empresa'));
      })
    );
  }

  getCompanys(): Observable<string[]> {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('No se encontró el token en localStorage');
      return throwError(() => new Error('Token no encontrado'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>('http://localhost:8000/companies', { headers }).pipe(
      map(companies => companies.map(company => company))
    );
  }

  createCompany(company :any): Observable<string[]> {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('No se encontró el token en localStorage');
      return throwError(() => new Error('Token no encontrado'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>('http://localhost:8000/companies', company, { headers });

  }



}
