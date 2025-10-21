import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import { LoginService } from "../../services/login.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private loginService: LoginService , private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      rol: ['', Validators.required],
      city: ['', Validators.required],
      terms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      const usuarioJson = {
        id: 0,
        username: formValue.username,
        full_name: formValue.name,
        address: formValue.address,
        email: formValue.email,
        hashed_password: formValue.password,
        disabled: false,
        rol: formValue.rol,
        city: formValue.city
      };

      this.isLoading = true;
      this.loginService.createUser(usuarioJson).subscribe(() => {
        this.isLoading = false;
        localStorage.removeItem('access_token');


        const numero = 25000;
        localStorage.setItem(usuarioJson.username, numero.toString());

        this.router.navigate(['login']);



      }, error => {
        this.isLoading = false;
        console.error('Error al registrar usuario', error);
      });
    }
  }
}
