import {Component, OnInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe, CommonModule } from '@angular/common';
import {LoginService} from "../services/login.service";
import {OrdenService} from "../services/orden.service";
import { AuthStateService, AuthState } from "../services/auth-state.service";
import { PortfolioService, PortfolioData } from "../services/portfolio.service";
import { UserDataService, UserData } from "../services/user-data.service";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, // <-- NECESARIO para *ngIf
    DecimalPipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  userCountry: string = 'colombia';
  userName: string = 'Jhon Doe';
  userRole: string = 'Inversionista';
  portfolioUSD: number = 0;
  saldoDisponible: number = 0;
  gananciaPerdidaTotal: number = 0;
  porcentajeCambioTotal: number = 0;
  userlist = []
  money:any = 0
  user : any = ''
  isAdmin = false;
  isAdminRoute= false;
  
  // Nuevas propiedades para datos completos del usuario
  userCompleteData: UserData | null = null;
  totalOrdenes: number = 0;
  ordenesPendientes: number = 0;
  comisionesGanadas: number = 0;
  accionesUsuario: any[] = [];
  
  private portfolioInterval: any; // Para controlar el intervalo de actualización del portafolio
  private comisionistaInterval: any; // Para controlar el intervalo de actualización para comisionistas
  private authSubscription: Subscription = new Subscription();
  
  constructor(
    private readonly router: Router, 
    private readonly loginService: LoginService, 
    private readonly orderService: OrdenService,
    private readonly authStateService: AuthStateService,
    private readonly portfolioService: PortfolioService,
    private readonly userDataService: UserDataService
  ) {}

  ngOnInit(): void {
    if (this.router.url === '/admin') {
        this.isAdminRoute = true;
    }

    // Suscribirse a los cambios del estado de autenticación
    this.authSubscription = this.authStateService.authState$.subscribe((authState: AuthState) => {
      this.updateUserInfo(authState);
    });

    // Escuchar eventos de acciones completadas
    globalThis.addEventListener('userActionCompleted', () => {
      this.handleUserActionCompleted();
    });

    // Configurar el intervalo del portafolio si el usuario es accionista
    this.setupPortfolioInterval();
  }

  private updateUserInfo(authState: AuthState): void {
    if (authState.isAuthenticated && authState.user) {
      this.user = authState.user;
      this.userName = authState.user.full_name;
      this.userRole = authState.userRole;
      this.isAdmin = authState.isAdmin;
      this.userCountry = authState.userCountry;
      
      // Cargar datos completos del usuario
      this.loadUserCompleteData();
      
      // Reconfigurar el intervalo del portafolio si es necesario
      this.setupPortfolioInterval();
    } else {
      this.user = null;
      this.userName = 'Usuario';
      this.userRole = 'Desconocido';
      this.isAdmin = false;
      this.userCountry = '';
      this.userCompleteData = null;
      this.totalOrdenes = 0;
      this.ordenesPendientes = 0;
      this.comisionesGanadas = 0;
      this.accionesUsuario = [];
      
      // Limpiar el intervalo si no hay usuario autenticado
      if (this.portfolioInterval) {
        clearInterval(this.portfolioInterval);
        this.portfolioInterval = null;
      }
    }
  }

  private setupPortfolioInterval(): void {
    // Limpiar intervalos anteriores si existen
    if (this.portfolioInterval) {
      clearInterval(this.portfolioInterval);
      this.portfolioInterval = null;
    }
    if (this.comisionistaInterval) {
      clearInterval(this.comisionistaInterval);
      this.comisionistaInterval = null;
    }

    // Configurar intervalos según el rol del usuario
    if (this.user?.id) {
      if (this.userRole === 'Accionista') {
        // Para accionistas: actualizar portafolio cada 5 segundos
        this.loadPortfolioData();
        
        this.portfolioInterval = setInterval(() => {
          if (this.user?.id) {
            this.loadPortfolioData();
          }
        }, 5000);
      } else if (this.userRole === 'Comisionista') {
        // Para comisionistas: actualizar datos cada 10 segundos (más suave)
        this.loadComisionistaData();
        
        this.comisionistaInterval = setInterval(() => {
          if (this.user?.id) {
            this.loadComisionistaData();
          }
        }, 10000); // Actualizar cada 10 segundos para ser menos brusco
      }
    }
  }

  private loadUserCompleteData(): void {
    if (!this.user?.id) return;

    // Cargar datos del portafolio para accionistas
    if (this.userRole === 'Accionista') {
      this.loadPortfolioData();
    }

    // Cargar datos específicos según el rol
    if (this.userRole === 'Comisionista') {
      this.loadComisionistaData();
    } else if (this.userRole === 'Accionista') {
      this.loadAccionistaData();
    }
  }

  private loadPortfolioData(): void {
    if (this.user?.id) {
      this.portfolioService.getPortfolio(this.user.id).subscribe({
        next: (portfolioData: PortfolioData) => {
          this.saldoDisponible = portfolioData.saldo_disponible;
          this.portfolioUSD = portfolioData.valor_total_portafolio;
          this.gananciaPerdidaTotal = portfolioData.ganancia_perdida_total;
          this.porcentajeCambioTotal = portfolioData.porcentaje_cambio_total;
          this.money = portfolioData.saldo_disponible; // Mantener compatibilidad con el template
          this.accionesUsuario = portfolioData.acciones || [];
          
          // Actualizar también el localStorage con el saldo más reciente
          const username = localStorage.getItem('username');
          if (username) {
            localStorage.setItem(username, portfolioData.saldo_disponible.toString());
          }
        },
        error: (err) => {
          console.error('Error al cargar datos del portafolio:', err);
          // Si es un error 401, limpiar el token y redirigir
          if (err.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            this.authStateService.onLogout();
          }
        }
      });
    }
  }

  private loadComisionistaData(): void {
    if (!this.user?.id) return;

    // Cargar todas las órdenes para comisionistas
    this.userDataService.getAllOrders().subscribe({
      next: (orders) => {
        this.totalOrdenes = orders.length;
        this.ordenesPendientes = orders.filter(order => order.estado === 'PENDIENTE').length;
        
        // Calcular comisiones ganadas (ejemplo: 1% de cada orden aprobada)
        this.comisionesGanadas = orders
          .filter(order => order.estado === 'APROBADA')
          .reduce((total, order) => total + (order.precio * 0.01), 0);
      },
      error: (err) => {
        console.error('Error al cargar datos del comisionista:', err);
        if (err.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          this.authStateService.onLogout();
        }
      }
    });

    // Cargar órdenes pendientes
    this.userDataService.getPendingOrders().subscribe({
      next: (pendingOrders) => {
        this.ordenesPendientes = pendingOrders.length;
      },
      error: (err) => {
        console.error('Error al cargar órdenes pendientes:', err);
      }
    });
  }

  private loadAccionistaData(): void {
    if (!this.user?.id) return;

    // Cargar órdenes del usuario
    this.userDataService.getUserOrders(this.user.id).subscribe({
      next: (orders) => {
        console.log('Órdenes del accionista actualizadas:', orders.length);
        this.totalOrdenes = orders.length;
        this.ordenesPendientes = orders.filter(order => order.estado === 'PENDIENTE').length;
      },
      error: (err) => {
        console.error('Error al cargar órdenes del accionista:', err);
        if (err.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          this.authStateService.onLogout();
        }
      }
    });
  }

  ngOnDestroy() {
    // Limpiar la suscripción
    this.authSubscription.unsubscribe();
    
    // Limpiar el event listener
    globalThis.removeEventListener('userActionCompleted', this.handleUserActionCompleted);
    
    // Limpiar los intervalos cuando el componente se destruye
    if (this.portfolioInterval) {
      clearInterval(this.portfolioInterval);
    }
    if (this.comisionistaInterval) {
      clearInterval(this.comisionistaInterval);
    }
  }

  // Método para manejar cuando se completa una acción de usuario
  private handleUserActionCompleted(): void {
    // Actualizar datos completos del usuario de manera suave
    if (this.user?.id) {
      this.loadUserCompleteData();
    }
    
    // También notificar al componente principal para que actualice sus datos
    const event = new CustomEvent('forceLoadPrincipalData', {
      detail: { timestamp: new Date().toISOString() }
    });
    globalThis.dispatchEvent(event);
  }

  logout(): void {
    // Limpiar los intervalos antes de cerrar sesión
    if (this.portfolioInterval) {
      clearInterval(this.portfolioInterval);
      this.portfolioInterval = null;
    }
    if (this.comisionistaInterval) {
      clearInterval(this.comisionistaInterval);
      this.comisionistaInterval = null;
    }
    
    // Notificar al servicio de estado sobre el logout
    this.authStateService.onLogout();
    this.router.navigate(['/home']);
  }

  admin():void{
    this.router.navigate(['/admin']);
  }

  andina():void{
    this.router.navigate(['/andina']);
  }

  getFlagUrl(country: string): string {
    switch (country.toLowerCase()) {
      case 'colombia':
        return 'https://flagcdn.com/w40/co.png';
      case 'ecuador':
        return 'https://flagcdn.com/w40/ec.png';
      case 'peru':
        return 'https://flagcdn.com/w40/pe.png';
      default:
        return '';
    }
  }
}
