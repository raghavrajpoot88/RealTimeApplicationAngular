import { Injectable } from '@angular/core';
import { userMessage, loginInfo, userInfo, sendMessage, editMessage, GoogleUserRequest, LoginValues, SearchQuery } from '../model/userInfo';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  RequestVerificationToken: any;
  headers: HttpHeaders;
  requestOptions: any;

  constructor(private http:HttpClient,private cookie : CookieService) 
  {
        
    this.headers=new HttpHeaders({'Content-Type':'application/json','Authorization': `Bearer ${localStorage.getItem('token')}`});
    this.requestOptions={headers:this.headers};
   }
  loggedIn:boolean=false;
  login(){
    this.loggedIn=true;
  }
  logout(){
    localStorage.removeItem('token');
    this.loggedIn=false;
    console.log(localStorage.getItem('token'));
    
    return this.http.get<any>("https://localhost:44359/api/account/logout")
  }
  isAuthenticated(){
    return this.loggedIn;
  }


  userRegistration(data: userInfo):Observable<userInfo>{
    return this.http.post<userInfo>("https://localhost:44359/api/account/register",data);
  }
  
  userLogin(data:LoginValues):Observable<any>{
    // let header=new HttpHeaders({'RequestVerificationToken':this.RequestVerificationToken})
    const header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
 
    console.log("https://localhost:44359/connect/token",
    "username=" + data.userNameOrEmailAddress +
    "&password=" + data.password +
    "&grant_type=password" +
    "&client_id=chatterBox_App" +
    "&scope=offline_access chatterBox");


    
    
    return this.http.post<any>("https://localhost:44359/connect/token",
      "username=" + data.userNameOrEmailAddress +
      "&password=" + data.password +
      "&grant_type=password" +
      "&client_id=chatterBox_App" +
      "&scope=openid offline_access chatterBox",{headers:header});
  }

  googleLogin(googleUser: string):Observable<any>{
    let headers=new HttpHeaders()
    .set("Authorization",`bearer ${localStorage.getItem('token')}`)
    return this.http.post<any>("https://localhost:7174/api/User/google",{idToken:googleUser},{headers})
  }   
  
  userList():Observable<any>{
    let header =new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem('token')}`);
    return this.http.get<any>("https://localhost:44359/api/app/user",{headers:header})
  }
  getCurrentUser():Observable<any>{
    let header =new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem('token')}`);
    return this.http.get<any>("https://localhost:44359/api/app/message/current-user",{headers:header})
  }

  //* Conversation history
  userMessage(data:string):Observable<any>{
    let header=new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem('token')}`);
    return this.http.get<any>(`https://localhost:44359/api/app/message/messages/${data}?count=${20}&sort=asc`,{headers:header})
  }
  loadUserMessage(data:string,time:string):Observable<any>{
    let header=new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem('token')}`);
    return this.http.get<any>(`https://localhost:44359/api/app/message/messages/${data}?before=${time}&count=${20}&sort=asc`,{headers:header})
  }
  
  sendMessage(data:sendMessage):Observable<any>{
    let header=new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem('token')}`);
    return this.http.post<any>("https://localhost:44359/api/app/message/send",data,{headers:header})
  }

  editMessage(id:string,msgbody:editMessage):Observable<any>{
    let header=new HttpHeaders()
    .set("Authorization",`bearer ${localStorage.getItem('token')}`)
    return this.http.put<any>(`https://localhost:44359/api/app/message/${id}`,msgbody,{headers:header})
  }

  deleteMessage(id:string){
    let header=new HttpHeaders()
    .set("Authorization",`bearer ${localStorage.getItem('token')}`)
    return this.http.delete<any>(`https://localhost:44359/api/app/message/${id}`,{headers:header})
  }

  searchMessages(query:string):Observable<any>{
    let header=new HttpHeaders()
    .set("Authorization",`bearer ${localStorage.getItem('token')}`)
    return this.http.get<userMessage>(`https://localhost:44359/api/app/message/search?query=${query}`,{headers:header})
  }

  requestLogsData(timeInterval: number){
    let header=new HttpHeaders()
    .set("Authorization",`bearer ${localStorage.getItem('token')}`)
    return this.http.get<any>(`https://localhost:44359/api/app/logs/logs?timeSpan=${timeInterval}`,{headers:header})
  }
}
