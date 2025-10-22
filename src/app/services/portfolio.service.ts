import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

export interface PortfolioAction {
  accion_id: number;
  nombre_accion: string;
  cantidad: number;
  precio_promedio: number;
  valor_actual: number;
  ganancia_perdida: number;
  porcentaje_cambio: number;
}

export interface PortfolioData {
  usuario_id: number;
  saldo_disponible: number;
  valor_total_portafolio: number;
  ganancia_perdida_total: number;
  porcentaje_cambio_total: number;
  acciones: PortfolioAction[];
  fecha_actualizacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private readonly baseUrl = this.configService.apiUrl;

  constructor(private readonly http: HttpClient, private readonly configService: ConfigService) { }

  getPortfolio(usuarioId: number): Observable<PortfolioData> {
    return this.http.get<PortfolioData>(`${this.baseUrl}/portfolio/portfolio`, {
      params: { usuario_id: usuarioId.toString() }
    });
  }
}
