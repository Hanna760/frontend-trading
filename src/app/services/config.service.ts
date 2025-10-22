import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly isProduction = globalThis.location.hostname !== 'localhost';
  
  get apiUrl(): string {
    if (this.isProduction) {
      // URL de tu backend local expuesto con ngrok
      // Instala ngrok: npm install -g ngrok
      // Ejecuta: ngrok http 8000
      // Copia la URL HTTPS que te da (ej: https://abc123.ngrok.io)
      return 'https://tu-url-ngrok.ngrok.io'; // ⚠️ CAMBIA ESTA URL POR TU URL DE NGROK
    } else {
      // URL para desarrollo local
      return 'http://localhost:8000';
    }
  }

  get environment(): string {
    return this.isProduction ? 'production' : 'development';
  }
}
