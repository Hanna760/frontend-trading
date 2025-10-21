import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStateService, AuthState } from '../services/auth-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-status-card" *ngIf="authState.isAuthenticated">
      <h3>Estado del Usuario</h3>
      <div class="status-info">
        <p><strong>Nombre:</strong> {{ authState.user?.full_name }}</p>
        <p><strong>Usuario:</strong> {{ authState.user?.username }}</p>
        <p><strong>Rol:</strong> {{ authState.userRole }}</p>
        <p><strong>País:</strong> {{ authState.userCountry }}</p>
        <p><strong>Es Admin:</strong> {{ authState.isAdmin ? 'Sí' : 'No' }}</p>
      </div>
      <div class="status-indicator" [class]="getStatusClass()">
        {{ getStatusText() }}
      </div>
    </div>
    
    <div class="no-auth" *ngIf="!authState.isAuthenticated">
      <p>Usuario no autenticado</p>
    </div>
  `,
  styles: [`
    .user-status-card {
      background: linear-gradient(135deg, #23272f 0%, #00c853 100%);
      border-radius: 12px;
      padding: 1.5rem;
      margin: 1rem;
      color: white;
      box-shadow: 0 4px 20px rgba(0, 200, 83, 0.3);
    }
    
    .status-info p {
      margin: 0.5rem 0;
      font-size: 1rem;
    }
    
    .status-indicator {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      text-align: center;
      font-weight: bold;
    }
    
    .status-online {
      background: #00c853;
      color: white;
    }
    
    .status-offline {
      background: #ff5722;
      color: white;
    }
    
    .no-auth {
      background: #ff5722;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      margin: 1rem;
      text-align: center;
    }
  `]
})
export class UserStatusComponent implements OnInit, OnDestroy {
  authState: AuthState = {
    isAuthenticated: false,
    user: null,
    userRole: 'Desconocido',
    isAdmin: false,
    userCountry: ''
  };
  
  private authSubscription: Subscription = new Subscription();

  constructor(private authStateService: AuthStateService) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del estado de autenticación
    this.authSubscription = this.authStateService.authState$.subscribe((state: AuthState) => {
      this.authState = state;
      console.log('Estado del usuario actualizado:', state);
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  getStatusClass(): string {
    return this.authState.isAuthenticated ? 'status-online' : 'status-offline';
  }

  getStatusText(): string {
    return this.authState.isAuthenticated ? 'Usuario Activo' : 'Usuario Inactivo';
  }
}

