import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  private readonly baseUrl = 'http://localhost:8000';

  constructor(private readonly http: HttpClient , private readonly router : Router) { }

  createOrder(order :any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/order/`, order);
  }

  getOrder(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/order/`).pipe(
      map(actions => actions.filter(action => action.usuario_id === id))
    );
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/order/`);
  }

  calcularPortafolio(id: number): void {
    // Verificar que hay un token de autenticación antes de hacer la llamada
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.warn('No hay token de autenticación para calcular portafolio');
      return;
    }

    this.http.get<any[]>(`${this.baseUrl}/order/`).pipe(
      map(ordenes => ordenes.filter(orden => orden.usuario_id === id)),
      map(ordenesFiltradas => {
        let total = 0;
        for (const orden of ordenesFiltradas) {
          if (orden.tipo_orden.toUpperCase().includes('BUY')) {
            total += orden.precio;
          } else if (orden.tipo_orden.toUpperCase().includes('SELL')) {
            total -= orden.precio;
          }
        }
        return total;
      })
    ).subscribe({
      next: (portafolioTotal) => {
        localStorage.setItem('portafolio', JSON.stringify(portafolioTotal));
      },
      error: (err) => {
        console.error('Error al calcular el portafolio:', err);
        // Si es un error 401, limpiar el token y redirigir
        if (err.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          // No redirigir aquí para evitar bucles, el componente principal ya maneja esto
        }
      }
    });
  }

  // Método para aprobar una orden
  approveOrder(orderId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/order/${orderId}/approve`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Método para denegar una orden
  denyOrder(orderId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/order/${orderId}/deny`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Método para obtener órdenes pendientes de aprobación
  getPendingOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/order/pending/`);
  }
}