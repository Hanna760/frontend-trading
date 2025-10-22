import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';

export interface UserData {
  id: number;
  username: string;
  full_name: string;
  rol: number;
  city: number;
  saldo_disponible?: number;
  valor_total_portafolio?: number;
  ganancia_perdida_total?: number;
  porcentaje_cambio_total?: number;
  acciones?: any[];
  ordenes?: any[];
  total_ordenes?: number;
  ordenes_pendientes?: number;
  comisiones_ganadas?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private readonly baseUrl = this.configService.apiUrl;

  constructor(private readonly http: HttpClient, private readonly configService: ConfigService) { }

  /**
   * Obtiene todos los datos del usuario incluyendo portafolio y acciones
   */
  getUserCompleteData(userId: number): Observable<UserData> {
    return this.http.get<UserData>(`${this.baseUrl}/users/${userId}/complete-data`);
  }

  /**
   * Obtiene datos del portafolio del usuario
   */
  getUserPortfolio(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/portfolio/portfolio`, { 
      params: { usuario_id: userId.toString() }
    });
  }

  /**
   * Obtiene todas las órdenes del usuario
   */
  getUserOrders(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/order/`).pipe(
      map(orders => orders.filter(order => order.usuario_id === userId))
    );
  }

  /**
   * Obtiene todas las órdenes (para comisionistas)
   */
  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/order/`);
  }

  /**
   * Obtiene órdenes pendientes de aprobación
   */
  getPendingOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/order/pending/`);
  }

  /**
   * Obtiene estadísticas del usuario según su rol
   */
  getUserStats(userId: number, userRole: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${userId}/stats`, { 
      params: { role: userRole }
    });
  }
}
