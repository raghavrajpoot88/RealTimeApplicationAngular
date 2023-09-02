import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleUserRequest, LoginValues, loginInfo, tokens} from 'src/app/model/userInfo';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { SocialUser, GoogleLoginProvider } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() token= new EventEmitter(); 
  loginform!:FormGroup
  loginList:loginInfo[]=[];
  isregistered:boolean=true;
  errorMessage:string="";
  user!: GoogleUserRequest;
  googleUser!:GoogleUserRequest;
  errorMessageGoogle:string='';
constructor(private service:UserService, private router :Router ,private authService: SocialAuthService){}
  ngOnInit(): void {
    this.token.emit(this.loginList);

   this.loginform=new FormGroup({
    userNameOrEmailAddress:new FormControl(null,[Validators.required]),
    password:new FormControl(null,Validators.required)
   })

   this.authService.authState.subscribe(result=>{
    this.user=result;
    console.log(this.user);
    console.log(this.user.idToken);
    
    this.SignInWithGoolgle()
   })
  }
  
  
  onSubmitLogin(data:LoginValues){
    this.service.userLogin(data).subscribe(x=>{
    console.log(this.loginform.value);
    console.log(data);
    
      console.log(x)
      // this.loginList=[x]
      this.token=x.access_token;
      console.log(this.token);
      if(this.loginform.valid){
        localStorage.setItem('token',x.access_token); 
        this.service.login();
        this.router.navigate(["/chat"])
      }
    },
    ( e: any) => {
      if (e.status === 400 ) {
      this.isregistered=false
        this.errorMessage=e.error;
        console.log(this.errorMessage);
        console.log(e.error);
      } else {
        console.log('An error occurred:', e);
      }
    })
  }

  SignInWithGoolgle():void {
    this.service.googleLogin(this.user.idToken).subscribe((data)=>{
      console.log("inside signin");
      console.log(data);
      if(data.token){
        localStorage.setItem('token',data.token);
        this.service.login();
        this.router.navigate(["/chat"])
      }
      else{
        this.errorMessageGoogle="some error found in signinWithGoogle"
      }
      
    })
  }

  Signout() :any{
    this.authService.signOut();
  }

}
