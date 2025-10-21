import {Component, Inject, OnInit, AfterViewInit, OnDestroy, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, NgClass, NgFor, NgIf} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {CompaniesService} from "../services/companies.service";
import {ActionsService} from "../services/actions.service";
import {Router} from "@angular/router";
import {HeaderComponent} from "../header/header.component";
import {OrdenService} from "../services/orden.service";
import {ContractService} from "../services/contract.service";
import { AuthStateService, AuthState } from "../services/auth-state.service";
import { UserDataService } from "../services/user-data.service";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-principal-pane',
  standalone: true,
  imports: [NgFor, FormsModule, NgIf, HeaderComponent, NgClass],
  templateUrl: './principal-pane.component.html',
  styleUrl: './principal-pane.component.css',
})
export class PrincipalPaneComponent implements OnInit, AfterViewInit, OnDestroy {

  // Propiedades para controlar el colapso de secciones
  symbolsCollapsed = false
  
  // Control de peticiones para evitar llamadas duplicadas
  private isLoadingActions = false;
  private isLoadingContracts = false;
  private refreshInterval: any; // Para controlar el intervalo de actualización
  ordersCollapsed = false;
  sidebarCollapsed = false;

  symbolPrices: { [symbol: string]: number } = {
    ECO: 108.33,
    MSFT: 883.12,
    GOOGL: 742.46,
    AMZN: 648.55,
    META: 475.38,
    TSLA: 902.77,
    NVDA: 731.24,
    'BRK.B': 336.52,
    JPM: 559.61,
    JNJ: 604.92,
    V: 974.13,
    UNH: 682.41,
    HD: 356.07,
    PG: 681.88,
    XOM: 582.44,
    MA: 508.27,
    PFE: 691.30,
    KO: 267.96,
    DIS: 527.65,
    NFLX: 913.05,
    INTC: 122.58,
    BA: 663.91,
    WMT: 335.60,
    CSCO: 636.20,
    PYPL: 846.73,
    T: 899.43,
    VZ: 687.54,
    UNP: 808.92,
    MMM: 715.02,
    CAT: 294.63,
    RTX: 261.79,
    GS: 774.21,
    BABA: 248.99,
    MRK: 529.17,
    IBM: 296.40,
    ACN: 823.56,
    MS: 634.88,
    LMT: 905.44,
    CVX: 771.72,
    AMGN: 524.09,
    AMT: 197.31,
    CL: 575.80,
    BIIB: 313.57,
    SPG: 678.42,
    COF: 252.15,
    MCD: 845.66,
    COP: 467.38,
    WBA: 362.89,
    CB: 876.21,
    NSC: 437.05,
    SLB: 640.47,
    SYK: 919.62,
    TMO: 410.33,
    DHR: 319.14,
    LHX: 537.58,
    ZTS: 140.29,
    ISRG: 993.22,
    SYY: 153.06,
    ADBE: 948.75,
    MDT: 646.18,
    COST: 786.44,
    MSCI: 932.51,
    SBUX: 214.09,
    GM: 703.66,
    F: 148.32,
    ADP: 404.90,
    AXP: 715.41,
    FIS: 210.37,
    FISV: 284.03,
    AIG: 593.78,
    TDG: 471.02,
    PXD: 557.91,
    EOG: 135.44,
    PLD: 385.69,
    CME: 690.73,
    VRTX: 414.66,
    DE: 764.11,
    BMY: 520.28,
    ZBH: 194.87,
    KMB: 611.26,
    NTAP: 329.74,
    APD: 487.32,
    STZ: 603.90,
    WM: 170.82,
    PSA: 918.04,
    EQIX: 967.12,
    CCI: 415.23,
    PGR: 298.56,
    AFL: 286.45,
    OXY: 647.27,
    DD: 718.50,
    LRCX: 843.77,
    EFX: 689.64,
    MU: 121.08,
    CSX: 413.92,
    BAX: 504.27,
    INTU: 704.63,
    HUM: 726.48,
    HLT: 932.84,
    TGT: 890.70,
    GIS: 599.31,
    CHTR: 858.19,
    GILD: 207.22,
    MRNA: 114.73,
    KLAC: 987.55,
    PEP: 438.66,
    MELI: 936.41,
    XEL: 473.80,
    RSG: 285.04,
    CNC: 359.92,
    CBOE: 628.17,
    EXC: 226.11,
    LUV: 344.79,
    REGN: 558.37,
    AMAT: 955.48,
    DXC: 359.60,
    NOC: 816.03,
    C: 634.22,
    WDC: 381.74,
    UBER: 517.05,
    COO: 252.26,
    CTSH: 696.57,
    SBAC: 182.04,
    AON: 801.62,
    SRE: 271.80,
    HCA: 898.31,
    STT: 261.10,
    VLO: 877.44,
    CARR: 498.27,
    VFC: 309.72,
    LULU: 918.65,
    TROW: 316.50,
    CTAS: 569.91,
    RTN: 453.36,
    ABBV: 787.11,
    BDX: 238.64,
    EMR: 342.76,
    TSN: 674.80,
    SWKS: 704.15,
    WELL: 619.99,
    TFX: 152.74,
    CHD: 493.87,
    WMB: 240.51,
    GE: 884.09,
    AVGO: 909.32,
    WEC: 308.40,
    DOV: 557.01,
    FTV: 566.96,
    MCHP: 856.18,
    USB: 312.47,
    CPB: 184.50,
    NUE: 518.39,
    OKE: 679.16,
    AVY: 169.24,
    SO: 836.45,
    MRO: 556.22,
    SJM: 228.55,
    TAP: 788.70,
    XRX: 696.20,
    NEM: 890.14,
    RCL: 430.78,
    ZBRA: 450.83,
    RHI: 272.43,
    PNC: 651.09,
    ABT: 467.40,
    APTV: 557.39,
    EQR: 410.52,
    JCI: 476.66,
    SNA: 599.32,
    IDXX: 747.13,
    ETN: 973.58,
    ORLY: 892.71,
    TRV: 130.06,
    GPC: 847.28,
    VTRS: 260.83,
    FTNT: 921.46,
    IQV: 952.18,
    HAS: 101.55,
    ORCL: 403.36,
    TYL: 384.61,
    PKG: 597.77,
    SHW: 866.09,
    NVR: 219.46,
    FFIV: 489.68,
    MCO: 602.55,
    HRL: 229.83,
    CBRE: 728.19,
    EXR: 215.44,
    LYB: 940.62,
    RHT: 576.30,
    AEE: 515.71,
    TPR: 900.42,
    CLX: 430.20,
    MKTX: 686.23,
    SPLK: 563.41,
    NKE: 361.75,
    RMD: 933.66,
    HES: 771.88,
    HII: 423.19,
    VRSN: 812.50,
    VRTS: 597.24,
    TRIP: 371.02,
    FMC: 132.49,
    AAPL: 125.75,   // precio que ya tenías
    BXP: 188.33,
    SNPS: 857.47,
    KMX: 278.69,
    CPRT: 701.16,
    ANET: 640.55,
    MKC: 317.74,
    IFF: 549.63,
    NWL: 481.28,
    GRMN: 262.14,
    HRS: 931.22,
    TPX: 112.17,
    ALB: 415.92,
    ESS: 534.69,
    AEP: 625.38,
    GOOG: 793.04,
    HPE: 235.81,
    PRU: 873.57,
    CE: 199.08,
    CVS: 699.95,
    SNAP: 115.22,
    SPGI: 972.71,
    NEE: 809.37,
    LOW: 693.14,
    OMC: 548.63,
    FLIR: 429.56
  };

  contratos: any[] = [];
  selectedAction: any = null;
  searchQuery: string = ''; // Para almacenar el texto de búsqueda
  private sp500symbols: any[] = []
  widget: any; // Widget de TradingView // Referencia al widget de TradingView
  private isBrowser = false;
  filteredSymbols: string[] = [];
  public symbol: string = 'AAPL'; // Variable que almacena el símbolo seleccionado
  public  stockPrice : number =125.5;
  actions :any = []
  pendingOrders: any[] = [] // Órdenes pendientes de aprobación
  processedOrders: any[] = [] // Órdenes procesadas (aprobadas/denegadas)
  money = 0
  rol = 0
  error: string | null = null;
  private authSubscription: Subscription = new Subscription();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private companyService: CompaniesService,
    private actionService: ActionsService,
    private orderService: OrdenService,
    private contractService: ContractService,
    private route: Router,
    private authStateService: AuthStateService,
    private userDataService: UserDataService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Suscribirse a los cambios del estado de autenticación
    this.authSubscription = this.authStateService.authState$.subscribe((authState: AuthState) => {
      this.updateUserRole(authState);
    });

    // Escuchar eventos para forzar la carga de datos
    globalThis.addEventListener('forceLoadPrincipalData', () => {
      this.forceLoadData();
    });

    // Actualizar datos cada 15 segundos para ser menos brusco
    this.refreshInterval = setInterval(() => {
      this.getAllActions();
      this.getAllContracts();
    }, 15000); // Cambiado de 30 segundos a 15 segundos para mejor balance
  }

  private updateUserRole(authState: AuthState): void {
    if (authState.isAuthenticated && authState.user) {
      this.rol = authState.user.rol;
      
      // Cargar datos iniciales después de asignar el rol
      setTimeout(() => {
        this.getAllActions();
        this.getAllCompanies();
        this.getAllContracts();
      }, 200); // Aumentado el delay para asegurar que todo esté listo
    } else {
      this.rol = 0;
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      // Esperar un poco para que el DOM esté completamente renderizado
      setTimeout(() => {
        this.loadTradingViewWidget();
      }, 100);
    }
  }

  ngOnDestroy() {
    // Limpiar la suscripción
    this.authSubscription.unsubscribe();
    
    // Limpiar el event listener
    globalThis.removeEventListener('forceLoadPrincipalData', this.forceLoadData);
    
    // Limpiar el intervalo cuando el componente se destruye
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  private loadTradingViewWidget() {
    // Limpiar widget anterior si existe
    if (this.widget) {
      this.widget.remove();
    }

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.type = 'text/javascript';

      script.onload = () => {
        // @ts-ignore
        this.widget = new TradingView.widget({
          container_id: 'tradingview_12345',
          width: '100%',
        height: '100%',
        symbol: this.symbol || 'AAPL',
          interval: 'D',
          timezone: 'Etc/UTC',
        theme: 'dark',
          style: '1',
          locale: 'en',
        toolbar_bg: '#181c24',
          enable_publishing: false,
          hide_top_toolbar: false,
          save_image: false,
          studies: ['MACD@tv-basicstudies'],
        autosize: true,
        fullscreen: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        details: true,
        hotlist: true,
        calendar: true,
        show_popup_button: true,
        popup_width: '1000',
        popup_height: '650',
        no_referral_id: true,
        referrer_id: 'tradingview.com',
        disabled_features: ['use_localstorage_for_settings'],
        enabled_features: ['side_toolbar_in_fullscreen_mode'],
        overrides: {
          'paneProperties.background': '#181c24',
          'paneProperties.vertGridProperties.color': '#23272f',
          'paneProperties.horzGridProperties.color': '#23272f',
          'symbolWatermarkProperties.transparency': 90,
          'scalesProperties.textColor': '#e0e0e0'
        }
        });
      };

    script.onerror = () => {
      console.error('Error loading TradingView script');
      };

      document.body.appendChild(script);
  }

  // Este método se llama cuando un usuario hace clic en un símbolo de la tabla
  showSymbol(symbol: string): void {
    this.symbol = symbol; // Actualiza la variable de símbolo
    this.stockPrice = this.symbolPrices[this.symbol];
    
    // Actualizar el gráfico si el widget ya está cargado
    if (this.widget && this.isBrowser) {
      try {
        this.widget.setSymbol(symbol, 'D');
      } catch (error) {
        this.loadTradingViewWidget();
      }
    }
  }

  // Método para filtrar los símbolos basado en el término de búsqueda
  filterSymbols(): void {
    this.filteredSymbols = this.sp500symbols.filter(symbol =>
      symbol.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Métodos para controlar el colapso de secciones
  toggleSymbols(): void {
    this.symbolsCollapsed = !this.symbolsCollapsed;
  }

  toggleOrders(): void {
    this.ordersCollapsed = !this.ordersCollapsed;
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }



  sharesOwned = 0;
  buyQuantity = 1;

  increaseQuantity() {
    this.buyQuantity++;
  }

  decreaseQuantity() {
    if (this.buyQuantity > 1) {
      this.buyQuantity--;
    }
  }

  // Método para notificar al header sobre cambios en las acciones
  private notifyHeaderUpdate(): void {
    // Disparar un evento personalizado que el header puede escuchar
    const event = new CustomEvent('userActionCompleted', {
      detail: { timestamp: new Date().toISOString() }
    });
    globalThis.dispatchEvent(event);
  }

  buyStock() {
    this.sharesOwned += this.buyQuantity;

    const empresaId$ = this.companyService.getCompanyIdByName(this.symbol);

    const user = localStorage.getItem('user');



    if(user != null) {

      const id = JSON.parse(user).id;
      const username = JSON.parse(user).username;
      const money = localStorage.getItem(username);

      if (money !== null) {
        this.money = Number.parseFloat(money); // o Number(valor)
        if( this.money == 0){
          alert('Debe de cargar dinero mediante administracion')
          return;
        }

      empresaId$.subscribe((empresaId) => {
        const order = {
          id: 0,
          tipo_orden: "BUY-" + this.symbol,
          precio: this.stockPrice * this.buyQuantity,
          fecha_hora: this.getFechaHoraActual(),
          comision: 0.15 * (this.stockPrice * this.buyQuantity),
          usuario_id:id ,
          created_at: this.getFechaHoraActual(),
          update_at:null,
          deleted_at:null

        };

        this.money = this.money - order.precio;
        localStorage.removeItem(username);
        localStorage.setItem(username, this.money.toString());
        this.orderService.createOrder(order).subscribe({
          next: () => {
            // Notificar al header que se ha completado una acción
            this.notifyHeaderUpdate();
            // Actualizar la lista de acciones
            this.getAllActions();
          },
          error: (err) => {
            console.error('Error al crear la orden:', err);
            // Revertir el cambio en el dinero si hay error
            this.money = this.money + order.precio;
            localStorage.setItem(username, this.money.toString());
          }
        });
      });

    }
      }

  }

  sellStock() {
    this.sharesOwned += this.buyQuantity;

    const empresaId$ = this.companyService.getCompanyIdByName(this.symbol);

    const user = localStorage.getItem('user');

    if(user != null) {


      const id = JSON.parse(user).id;
      const username = JSON.parse(user).username;
      const money = localStorage.getItem(username);

      if (money !== null) {
        this.money = Number.parseFloat(money); // o Number(valor)
        if(this.money == 0){
          alert('Debe de cargar dinero mediante administracion')
          return;
        }

        empresaId$.subscribe((empresaId) => {
          const order = {
            id: 0,
            tipo_orden: "SELL-" + this.symbol,
            precio: this.stockPrice * this.buyQuantity,
            fecha_hora: this.getFechaHoraActual(),
            comision: 0.15 * (this.stockPrice * this.buyQuantity),
            usuario_id: id,
            created_at: this.getFechaHoraActual(),
            update_at: null,
            deleted_at: null

          };

          this.money = this.money - order.precio;
          localStorage.removeItem(username);
          localStorage.setItem(username, this.money.toString());

          this.orderService.createOrder(order).subscribe({
            next: () => {
              // Notificar al header que se ha completado una acción
              this.notifyHeaderUpdate();
              // Actualizar la lista de acciones
              this.getAllActions();
            },
            error: (err) => {
              console.error('Error al crear la orden:', err);
              // Revertir el cambio en el dinero si hay error
              this.money = this.money + order.precio;
              localStorage.setItem(username, this.money.toString());
            }
          });
        });
      }
    }

  }


  getFechaHoraActual(): string {
    const ahora = new Date();

    const year = ahora.getFullYear();
    const month = String(ahora.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
    const day = String(ahora.getDate()).padStart(2, '0');
    const hours = String(ahora.getHours()).padStart(2, '0');
    const minutes = String(ahora.getMinutes()).padStart(2, '0');
    const seconds = String(ahora.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // Método público para forzar la carga de datos (llamado desde el header)
  public forceLoadData(): void {
    if (this.rol !== 0) {
      this.getAllActions();
      this.getAllCompanies();
      this.getAllContracts();
    }
  }

  private getAllActions() {
    // Evitar llamadas duplicadas
    if (this.isLoadingActions) {
      return;
    }
    
    // Verificar que el rol esté asignado antes de proceder
    if (this.rol === 0) {
      console.log('Rol no asignado aún, esperando...');
      return;
    }
    
    this.isLoadingActions = true;
    const user = localStorage.getItem('user');

    if(user != null) {
      const id = JSON.parse(user).id;

      if(this.rol != 3) {
        // Para accionistas: obtener sus propias órdenes
        this.orderService.getOrder(id).subscribe({
          next: (data) => {
            // Ordenar por fecha, más recientes primero
            this.actions = data.sort((a: any, b: any) => {
              return new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime();
            });
            this.isLoadingActions = false;
          },
          error: (err) => {
            this.isLoadingActions = false;
            if (err.status === 401) {
              console.warn('No autorizado. Redirigiendo al home...');
              // Detener el intervalo de actualización automática
              if (this.refreshInterval) {
                clearInterval(this.refreshInterval);
                this.refreshInterval = null;
              }
              this.route.navigate(['/login']);
            } else {
              console.error('Error al obtener acciones:', err.message);
            }
          }
        });
      } else {
        // Para comisionistas: obtener TODAS las órdenes
        this.orderService.getOrders().subscribe({
          next: (data) => {
            // Separar órdenes por estado
            this.pendingOrders = data.filter((order: any) => order.estado === 'pending' || !order.estado)
              .sort((a: any, b: any) => {
                return new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime();
              });
            
            this.processedOrders = data.filter((order: any) => order.estado && order.estado !== 'pending')
              .sort((a: any, b: any) => {
                return new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime();
              });
            
            // Mantener actions para compatibilidad con el código existente
            this.actions = data.sort((a: any, b: any) => {
              return new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime();
            });
            this.isLoadingActions = false;
          },
          error: (err) => {
            this.isLoadingActions = false;
            console.error('Error completo al obtener todas las órdenes:', err);
            if (err.status === 401) {
              console.warn('No autorizado. Redirigiendo al home...');
              // Detener el intervalo de actualización automática
              if (this.refreshInterval) {
                clearInterval(this.refreshInterval);
                this.refreshInterval = null;
              }
              this.route.navigate(['/login']);
            } else {
              console.error('Error al obtener todas las órdenes:', err.message);
              console.error('Status:', err.status);
              console.error('Error body:', err.error);
            }
          }
        });
      }
    } else {
      this.isLoadingActions = false;
    }
  }

  private getAllCompanies() {
    this.companyService.getCompanyNames().subscribe({
      next: (names) => {
        this.sp500symbols = names;
        this.filteredSymbols = [...names];  // Copiar los datos a filteredSymbols
      },
      error: (err) => {
        console.error('Error al obtener empresas:', err.message);
      }
    });
  }



  toggleDetails(action: any): void {
    if (this.selectedAction && this.selectedAction.id === action.id) {
      this.selectedAction = null; // Cierra si se vuelve a hacer clic en la misma
    } else {
      this.selectedAction = action;
    }
  }

  makeContract(usuario_id: any, comision: any){

    const user = localStorage.getItem('user');

    if(user != null) {


      const id = JSON.parse(user).id;


      const contract = {
        numero_contrato: 0,
        fecha_hora_inicio: this.getFechaHoraActual(),
        fecha_hora_fin: this.getFechaHoraActual(),
        comision: comision,
        inversionista_id:id,
        comisionista_id: usuario_id,
        created_at: this.getFechaHoraActual(),
        update_at: null,
        deleted_at: null
      }

      this.contractService.createContract(contract).subscribe(() => {
      })


    }

    this.selectedAction = ''

  }

  private getAllContracts() {
    // Evitar llamadas duplicadas
    if (this.isLoadingContracts) {
      return;
    }
    
    this.isLoadingContracts = true;
    const user = localStorage.getItem('user');
    if (user != null) {
      const id = JSON.parse(user).id;

      this.contractService.getContracts(id).subscribe({
        next: (names) => {
          this.contratos = names;
          this.isLoadingContracts = false;
        },
        error: (err) => {
          this.isLoadingContracts = false;
          console.error('Error al obtener contratos:', err.message);
        }
      });
    } else {
      this.isLoadingContracts = false;
    }
  }

  // Método para obtener órdenes pendientes de aprobación
  private getPendingOrders() {
    if (this.rol === 3) { // Solo para comisionistas
      this.orderService.getPendingOrders().subscribe({
        next: (orders) => {
          this.pendingOrders = orders.sort((a: any, b: any) => {
            return new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime();
          });
        },
        error: (err) => {
          console.error('Error al obtener órdenes pendientes:', err.message);
        }
      });
    }
  }

  // Método para probar la conexión con el backend
  testBackendConnection() {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      alert('❌ No hay token de autenticación disponible');
      return;
    }
    
    // Probar diferentes endpoints según el rol
    if (this.rol === 3) {
      this.orderService.getOrders().subscribe({
        next: (data) => {
          alert(`✅ Conexión exitosa! Se recibieron ${data.length} órdenes`);
        },
        error: (err) => {
          alert(`❌ Error en la conexión: ${err.message || 'Error desconocido'}`);
        }
      });
    } else {
      const user = localStorage.getItem('user');
      if (user) {
        const userId = JSON.parse(user).id;
        this.orderService.getOrder(userId).subscribe({
          next: (data) => {
            alert(`✅ Conexión exitosa! Se recibieron ${data.length} órdenes del usuario`);
          },
          error: (err) => {
            alert(`❌ Error en la conexión: ${err.message || 'Error desconocido'}`);
          }
        });
      }
    }
  }

  // Método para aprobar una orden
  approveOrder(orderId: number) {
    this.orderService.approveOrder(orderId).subscribe({
      next: (response) => {
        // Remover la orden de la lista de acciones
        this.actions = this.actions.filter((action: any) => action.id !== orderId);
        // También remover de pendingOrders si existe
        this.pendingOrders = this.pendingOrders.filter((order: any) => order.id !== orderId);
        
        // Mostrar mensaje de éxito
        alert('✅ Orden aprobada exitosamente');
        
        // Recargar la lista de órdenes
        this.getAllActions();
      },
      error: (err) => {
        console.error('Error al aprobar la orden:', err);
        
        // Mostrar mensaje de error más detallado
        let errorMessage = 'Error al aprobar la orden';
        
        if (err.status === 0) {
          errorMessage = 'Error de conexión: No se pudo conectar con el servidor. Verifique que el backend esté ejecutándose en http://localhost:8000';
        } else if (err.error && err.error.message) {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message;
        } else if (err.status) {
          errorMessage = `Error HTTP ${err.status}: ${err.statusText || 'Error del servidor'}`;
        }
        
        alert(`❌ ${errorMessage}`);
      }
    });
  }

  // Método para denegar una orden
  denyOrder(orderId: number) {
    this.orderService.denyOrder(orderId).subscribe({
      next: (response) => {
        // Remover la orden de la lista de acciones
        this.actions = this.actions.filter((action: any) => action.id !== orderId);
        // También remover de pendingOrders si existe
        this.pendingOrders = this.pendingOrders.filter((order: any) => order.id !== orderId);
        
        // Mostrar mensaje de éxito
        alert('❌ Orden denegada exitosamente');
        
        // Recargar la lista de órdenes
        this.getAllActions();
      },
      error: (err) => {
        console.error('Error al denegar la orden:', err);
        
        // Mostrar mensaje de error más detallado
        let errorMessage = 'Error al denegar la orden';
        
        if (err.status === 0) {
          errorMessage = 'Error de conexión: No se pudo conectar con el servidor. Verifique que el backend esté ejecutándose en http://localhost:8000';
        } else if (err.error && err.error.message) {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message;
        } else if (err.status) {
          errorMessage = `Error HTTP ${err.status}: ${err.statusText || 'Error del servidor'}`;
        }
        
        alert(`❌ ${errorMessage}`);
      }
    });
  }
}
