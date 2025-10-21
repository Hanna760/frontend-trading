import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStateService, AuthState } from '../services/auth-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-role-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="role-test-card">
      <h3>🧪 Prueba de Detección de Roles</h3>
      
      <div class="current-state">
        <h4>Estado Actual:</h4>
        <div class="state-info">
          <p><strong>Autenticado:</strong> {{ authState.isAuthenticated ? 'Sí' : 'No' }}</p>
          <p><strong>Usuario:</strong> {{ authState.user?.username || 'N/A' }}</p>
          <p><strong>Rol:</strong> {{ authState.userRole }}</p>
          <p><strong>ID Rol:</strong> {{ authState.user?.rol || 'N/A' }}</p>
          <p><strong>Es Admin:</strong> {{ authState.isAdmin ? 'Sí' : 'No' }}</p>
        </div>
      </div>

      <div class="role-indicators">
        <div class="indicator" [class.active]="authState.user?.rol === 1">
          <span class="indicator-icon">👑</span>
          <span class="indicator-text">Admin</span>
        </div>
        <div class="indicator" [class.active]="authState.user?.rol === 2">
          <span class="indicator-icon">👤</span>
          <span class="indicator-text">Accionista</span>
        </div>
        <div class="indicator" [class.active]="authState.user?.rol === 3">
          <span class="indicator-icon">💼</span>
          <span class="indicator-text">Comisionista</span>
        </div>
      </div>

      <div class="test-actions">
        <button class="test-btn" (click)="refreshData()">
          🔄 Refrescar Datos
        </button>
        <button class="test-btn" (click)="forceRefresh()">
          ⚡ Forzar Actualización
        </button>
      </div>

      <div class="last-update">
        <small>Última actualización: {{ lastUpdate | date:'medium' }}</small>
      </div>
    </div>
  `,
  styles: [`
    .role-test-card {
      background: linear-gradient(135deg, #23272f 0%, #181c24 100%);
      border-radius: 12px;
      padding: 1.5rem;
      margin: 1rem;
      color: white;
      box-shadow: 0 4px 20px rgba(0, 200, 83, 0.3);
      border: 1px solid rgba(0, 200, 83, 0.3);
    }
    
    .role-test-card h3 {
      color: #00c853;
      margin: 0 0 1rem 0;
      text-align: center;
    }
    
    .current-state {
      margin-bottom: 1rem;
    }
    
    .current-state h4 {
      color: #ff9100;
      margin: 0 0 0.5rem 0;
    }
    
    .state-info p {
      margin: 0.3rem 0;
      font-size: 0.9rem;
    }
    
    .role-indicators {
      display: flex;
      justify-content: space-around;
      margin: 1rem 0;
    }
    
    .indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.5rem;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      transition: all 0.3s ease;
    }
    
    .indicator.active {
      background: rgba(0, 200, 83, 0.2);
      border: 1px solid #00c853;
      transform: scale(1.05);
    }
    
    .indicator-icon {
      font-size: 1.5rem;
      margin-bottom: 0.3rem;
    }
    
    .indicator-text {
      font-size: 0.8rem;
      font-weight: bold;
    }
    
    .test-actions {
      display: flex;
      gap: 0.5rem;
      margin: 1rem 0;
    }
    
    .test-btn {
      flex: 1;
      background: linear-gradient(45deg, #00c853, #009624);
      border: none;
      color: white;
      padding: 0.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    
    .test-btn:hover {
      background: linear-gradient(45deg, #ff9100, #ff6f00);
      transform: translateY(-2px);
    }
    
    .last-update {
      text-align: center;
      color: #888;
      font-size: 0.8rem;
    }
  `]
})
export class RoleTestComponent implements OnInit, OnDestroy {
  authState: AuthState = {
    isAuthenticated: false,
    user: null,
    userRole: 'Desconocido',
    isAdmin: false,
    userCountry: ''
  };
  
  lastUpdate: Date = new Date();
  private authSubscription: Subscription = new Subscription();

  constructor(private authStateService: AuthStateService) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del estado de autenticación
    this.authSubscription = this.authStateService.authState$.subscribe((state: AuthState) => {
      this.authState = state;
      this.lastUpdate = new Date();
      console.log('🧪 RoleTest: Estado actualizado:', state);
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  refreshData(): void {
    this.authStateService.refreshUserData();
  }

  forceRefresh(): void {
    this.authStateService.forceRefresh();
  }
}

