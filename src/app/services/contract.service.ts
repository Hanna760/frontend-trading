import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {map, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor(private http: HttpClient , private router : Router) { }


  createContract(contract :any): Observable<string[]> {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('No se encontró el token en localStorage');
      return throwError(() => new Error('Token no encontrado'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>('http://localhost:8000/contracts/', contract, { headers });

  }

  getContracts(id: any) {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('No se encontró el token en localStorage');
      return throwError(() => new Error('Token no encontrado'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>('http://localhost:8000/contracts/', { headers }).pipe(
      map(actions => actions.filter(action => action.inversionista_id === id))
    );
  }




}
