import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import {PrincipalPaneComponent} from "./principal-pane/principal-pane.component";
import {AdminComponent} from "./admin/admin.component";

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'andina', component: PrincipalPaneComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' },


];
