import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HeaderComponent} from "../header/header.component";
import {CompaniesService} from "../services/companies.service";
import {NgFor, NgIf} from "@angular/common";
import {LoginService} from "../services/login.service";
import {catchError} from "rxjs";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    HeaderComponent,
    NgFor,
    NgIf
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements  OnInit{

  empresas: any[] = [];
  usuarios: any[] = [];
  empresaForm: FormGroup;
  money  = 0
  selectedUser: any | null = null;
  sectores = [
    { id: 1, nombre: 'Agricultura' },
    { id: 2, nombre: 'Industria' },
    { id: 3, nombre: 'Servicios' },
    { id: 4, nombre: 'Tecnología' },
    { id: 5, nombre: 'Energía' },
    { id: 6, nombre: 'Comercio' },
    { id: 7, nombre: 'Construcción' },
    { id: 8, nombre: 'Transporte' },
    { id: 9, nombre: 'Finanzas' },
    { id: 10, nombre: 'Turismo' }
  ];


  constructor(private fb: FormBuilder ,
              private  companyService:CompaniesService ,
              private userService : LoginService) {
    this.empresaForm = this.fb.group({
      nombre: [''],
      descripcion: [''],
      sector_economico_id: [''],
    });
  }

  ngOnInit() {
    this.getEmpresas();
    this.getUsuarios();
    setInterval(() => {
      this.getEmpresas();
      this.getUsuarios();
    }, 2000);
  }

  getEmpresas() {
    this.companyService.getCompanys().subscribe({
      next: (names) => {
        this.empresas = names;
      },
      error: (err) => {
        console.error('Error al obtener empresas:', err.message);
      }
    });
  }

  getUsuarios() {

    this.userService.getUsers()
      .pipe(
        catchError(err => {
          console.error('Error al cargar usuarios:', err);
          return []; // Retorna arreglo vacío si hay error
        })
      )
      .subscribe((data: any) => {
        this.usuarios = data;
      });

  }

  crearEmpresa() {
    const nuevaEmpresa = this.empresaForm.value;
    nuevaEmpresa.id = this.empresas.length + 1;
    nuevaEmpresa.created_at = new Date().toISOString();

    const empresa = {
      id: 0,
      nombre: this.empresaForm.value.nombre,
      descripcion: this.empresaForm.value.descripcion,
      sector_economico_id: this.empresaForm.value.sector_economico_id
    };

    this.companyService.createCompany(empresa).subscribe(() => {
    })

    this.resetearFormulario()
  }

  resetearFormulario() {
    this.empresaForm.reset({
      nombre: '',
      descripcion: '',
      sector_economico_id: ''
    });
  }


  editarUsuario(usuario: any) {
    this.selectedUser = { ...usuario };

    const username = this.selectedUser.username;

    if (username) {
      const money = localStorage.getItem(username);

      if (money !== null) {
        this.money = parseFloat(money);
        if (this.money === 0) {
          alert('Debe de cargar dinero mediante administración');
          return;
        }
      } else {
        this.money = 0; // Valor por defecto si no hay dinero almacenado
      }
    }
  }


  guardarUsuario() {
    if (!this.selectedUser) return;

    const index = this.usuarios.findIndex(u => u.id === this.selectedUser!.id);
    if (index !== -1) {
      this.usuarios[index] = this.selectedUser!;
    }

    // Guardar el dinero editado
    const username = this.selectedUser.username;
    if (username) {
      localStorage.setItem(username, this.money.toString());
    }

    this.selectedUser = null;
  }

}
