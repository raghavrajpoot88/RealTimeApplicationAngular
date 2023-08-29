import { registerLocaleData } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './registration/register/register.component';
import { LoginComponent } from './login/login/login.component';
import { UserListComponent } from './user-list/user-list.component';
import { MainPageComponent } from './main-page/main-page.component';
import { LogsComponent } from './logs/logs.component';
// import { restrictGuard } from './restrict.guard';

const routes: Routes = [
  {path:"", component:MainPageComponent},
  {path:"register", component:RegisterComponent},
  {path:"login", component:LoginComponent},
  {path:"chat", component:UserListComponent},
  // ,canActivate:[restrictGuard]
  {path:"log", component:LogsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
