import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { userInfo } from '../../model/userInfo';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  registerform!: FormGroup;

  constructor(private _fb:FormBuilder, private http:HttpClient,private signUp:UserService, private router:Router){}
  ngOnInit(): void {
    this.registerform=new FormGroup({
      emailAddress:new FormControl(null,[Validators.email,Validators.required]) ,
      userName:new FormControl(null,[Validators.required,Validators.minLength(5)]) ,
      password:new FormControl(null,[Validators.required,Validators.minLength(8)]) 
    })
  }
  onSubmit(data:userInfo):void{
    console.log(this.registerform.value);
    data.appName="chatterBox"
    this.signUp.userRegistration(data).subscribe(x=>{
      console.log(x)
      if(this.registerform.valid){
        this.router.navigate(["/login"])
      }
    },
    (error)=>{
      if (error.status === 400) {
        console.log('An error occurred:', error.error);
      } else {
        console.error(
          `Backend returned code ${error.status}, body was: `, error.error);
      }
    });
  }
}
