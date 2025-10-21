import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface User {
  id: number;
  username: string;
  full_name: string;
  rol: number;
  city: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  userRole: string;
  isAdmin: boolean;
  userCountry: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    userRole: 'Desconocido',
    isAdmin: false,
    userCountry: ''
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const token = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
      this.loadUserData();
    }
  }

  private loadUserData(): void {
    const username = localStorage.getItem('username');
    if (!username) return;

    this.getUsers().subscribe({
      next: (users) => {
        const foundUser = users.find((u: any) => u.username === username);
        if (foundUser) {
          this.updateUserState(foundUser);
        }
      },
      error: (err) => {
        console.error('Error al cargar datos del usuario:', err);
        this.clearAuthState();
      }
    });
  }

  private updateUserState(user: User): void {
    // Asignar rol
    let userRole: string;
    let isAdmin = false;
    
    switch (user.rol) {
      case 1:
        userRole = 'ADMIN';
        isAdmin = true;
        break;
      case 2:
        userRole = 'Accionista';
        break;
      case 3:
        userRole = 'Comisionista';
        break;
      default:
        userRole = 'Desconocido';
    }

    // Asignar país
    let userCountry: string;
    switch (user.city) {
      case 1:
        userCountry = 'colombia';
        break;
      case 2:
        userCountry = 'ecuador';
        break;
      case 3:
        userCountry = 'peru';
        break;
      default:
        userCountry = '';
    }

    const newState: AuthState = {
      isAuthenticated: true,
      user: user,
      userRole: userRole,
      isAdmin: isAdmin,
      userCountry: userCountry
    };

    this.authStateSubject.next(newState);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearAuthState(): void {
    const newState: AuthState = {
      isAuthenticated: false,
      user: null,
      userRole: 'Desconocido',
      isAdmin: false,
      userCountry: ''
    };
    this.authStateSubject.next(newState);
  }

  private getUsers(): Observable<any> {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('Token no encontrado');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get('http://localhost:8000/users/', { headers });
  }

  // Método público para refrescar los datos del usuario
  refreshUserData(): void {
    this.loadUserData();
  }

  // Método para forzar una actualización completa del estado
  forceRefresh(): void {
    const token = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
      this.loadUserData();
    } else {
      this.clearAuthState();
    }
  }

  // Método para actualizar el estado después del login
  onLoginSuccess(username: string): void {
    localStorage.setItem('username', username);
    this.loadUserData();
  }

  // Método para limpiar el estado después del logout
  onLogout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    this.clearAuthState();
  }

  // Métodos de conveniencia para obtener valores específicos
  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  getCurrentRole(): string {
    return this.authStateSubject.value.userRole;
  }

  isUserAdmin(): boolean {
    return this.authStateSubject.value.isAdmin;
  }

  isUserAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  // Método para obtener el estado actual sin suscribirse
  getCurrentAuthState(): AuthState {
    return this.authStateSubject.value;
  }

  // Método para verificar si el usuario tiene un rol específico
  hasRole(roleId: number): boolean {
    const currentState = this.getCurrentAuthState();
    return currentState.isAuthenticated && currentState.user?.rol === roleId;
  }

  // Método para verificar si el usuario es admin
  isCurrentUserAdmin(): boolean {
    return this.getCurrentAuthState().isAdmin;
  }
}
