import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  title = 'ANDINA TRADING';
  subtitle = 'Tu plataforma de trading profesional';
  features = [
    {
      title: 'Mercados Globales',
      description: 'Accede a los principales mercados financieros del mundo',
      icon: '🌍'
    },
    {
      title: 'Análisis Técnico',
      description: 'Herramientas avanzadas para el análisis de mercados',
      icon: '📊'
    },
    {
      title: 'Seguridad',
      description: 'Protección de datos y transacciones seguras',
      icon: '🔒'
    }
  ];
} 