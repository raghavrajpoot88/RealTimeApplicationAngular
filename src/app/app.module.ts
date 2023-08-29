import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './registration/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { LoginComponent } from './login/login/login.component';
import { UserListComponent } from './user-list/user-list.component';
import { MainPageComponent } from './main-page/main-page.component';
import { LogsComponent } from './logs/logs.component';
import { CommonModule } from '@angular/common';
import { GoogleLoginProvider, SocialAuthServiceConfig} from '@abacritt/angularx-social-login';
import { SocialLoginModule} from '@abacritt/angularx-social-login';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
// import { restrictGuard } from './restrict.guard';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    UserListComponent,
    MainPageComponent,
    LogsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatMenuModule,
    BrowserAnimationsModule,
    CommonModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    
    
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '455670740633-4tletg44i13sn34v0tegikver5u8elfd.apps.googleusercontent.com'
            )
          }
        ],
      } as SocialAuthServiceConfig,
    },
    CookieService
    // ,restrictGuard 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
