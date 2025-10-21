import { CommonModule } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {LoginService} from "../../services/login.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements  OnInit {
  loginForm: FormGroup;
  isLoading = false;
  userList : any [] = []
  username : string = "";


  constructor(
    private fb: FormBuilder ,
    private loginService : LoginService,
    private router : Router) {


    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required,]]
    });

  }

  ngOnInit(): void {
    // Ya no necesitamos cargar usuarios automáticamente aquí
    // El AuthStateService se encargará de esto cuando sea necesario
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      // TODO: Implement login logic
      this.username = this.loginForm.value.username;
      localStorage.setItem('username', this.username);
      this.loginService.login(this.loginForm.value.username , this.loginForm.value.password)
      this.isLoading = false;
    }
  }
}
