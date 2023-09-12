import { Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { Location } from '@angular/common';

import { userMessage, userList,sendMessage, editMessage, logs, loginInfo, tokens, SearchQuery } from '../model/userInfo';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  list:userList[]=[];
  msgList:userMessage[]=[];
  searchData:userMessage[]=[];
  data:sendMessage = { ReceiverId: "", MsgBody: "" };
  SearchMessage:SearchQuery={query:""};
  
  editDeleteMessage:string="";
  nameOfReceiver:string='';
  tt !:string ;
  errorMessage:string='';
  LoggedInUserId: string="";
  isUserMessage:Boolean=true;
  checkLoader:Boolean=false;
  scrollToBottomEnabled: boolean = true; 

  
  messageform!:FormGroup
  editform!:FormGroup
  searchform!:FormGroup

  private _hubConnection!: HubConnection
  previousScrollTop!: number;

  constructor(private service:UserService , private router:Router, private location: Location){}
  ngOnInit(): void {
    this.getList();
    this.CurrentUser();

    this.messageform=new FormGroup({
      MsgBody:new FormControl(null,Validators.required)
    })
    this.editform=new FormGroup({
      content:new FormControl(null,Validators.required)    
    })
    console.log(this.editform.value);

    this.searchform=new FormGroup({
      query:new FormControl(null ,Validators.required)
    })

    //?Token value 
    this.tt = localStorage.getItem('token')!;

    //?Real-time implementation
    let headers=new HttpHeaders()
    .set("Authorization",`bearer ${localStorage.getItem('token')}`)
    this._hubConnection=new HubConnectionBuilder().withUrl('https://localhost:44359/hub',{ accessTokenFactory: () => this.tt }).build();
    
    this._hubConnection.start()
    .then(()=>
      console.log("Realtime connection started"))
    .catch(error=>{
      console.log("Erroring occuring at connection establishment")
    });

    this._hubConnection.on('ReceiveMessage',(data:userMessage)=>{
      this.msgList.push(data);
      console.log(data);
      console.log(this.msgList);
    });
    // Real time edit message
    this._hubConnection.on('ReceiveEditMessage',(Message:userMessage)=>{
      const editedMsgIndex = this.msgList.findIndex(msg => msg.id === Message.id);
      if (editedMsgIndex !== -1) {
        this.msgList[editedMsgIndex].msgBody = Message.msgBody;
        this.msgList = [...this.msgList];
      }
    })
    // Real time message delete
    this._hubConnection.on('ReceiveDeleteMessage',(data:userMessage)=>{
      const indexToRemove = this.msgList.findIndex(item => item.id === data.id);
      console.log(indexToRemove);
      if (indexToRemove !== -1) {
        this.msgList.splice(indexToRemove, 1);
      }
    })
  }

  sendMessage(){
      this.data.MsgBody=this.messageform.get('MsgBody')?.value;
      console.log(this.data);
      this.service.sendMessage(this.data).subscribe((result:userMessage)=>{
        console.log(result);
        
        this.msgList.push(result);
        if (this.msgList.length > 20) {
          this.msgList.splice(0, this.msgList.length - 20);
        }
        console.log(this.msgList); 
        this._hubConnection.invoke('NewMessage', result);
        this.messageform.reset();
      })
      this.bottom();
  }
  

  //* Get the User list.
  getList(){
    this.service.userList().subscribe(list=>{
      console.log(list);      
      this.list=list.items;
      console.log(this.list);
    })
  }
  //* Get Current User
  CurrentUser(){
    this.service.getCurrentUser().subscribe(x=>{
      this.LoggedInUserId=x
      console.log(this.LoggedInUserId); 
    })
  }
  
  //* Get conversation history of an user.
  getMessage(data:userList){
    //this.location.replaceState(`/chat/user/${data.id}`);
    this.isUserMessage=true;
    this.service.userMessage(data.id).subscribe(result=>{
      this.msgList=result;
      console.log(result);
      this.data.ReceiverId=data.id;
      this.nameOfReceiver=data.userName;
      console.log(data.userName);
      this.bottom();
      this.checkLoader=false;
    });
  }

  
 // Load More message on scroll.
  olderMessage(event:Event):void{
    const scrollableDiv = document.querySelector('.scrollableDiv');
    if (scrollableDiv) {     
        if (scrollableDiv!.scrollTop === 0 && this.msgList.length> 0) {
          this.checkLoader=true;
          this.scrollToBottomEnabled = false;
          setTimeout(()=>{
            this.service.loadUserMessage( this.data.ReceiverId, this.msgList[0].timeStamp).subscribe((result) => {
                console.log(result);
                if (result.length === 0) {
                    this.checkLoader = false;
                    alert("No more Message");
                }
                if (result.length > 0) {
                  this.msgList = [...result, ...this.msgList];
                }
                scrollableDiv.scrollTop = this.previousScrollTop;
                this.scrollToBottomEnabled = true;
              });
              this.checkLoader=false;
          },2000);
        
      }
    }
  }
  // Scroll to bottom.
  private bottom():void{
    setTimeout(()=>{
      const scrollableDiv = document.querySelector('.scrollableDiv');
        if(scrollableDiv && this.scrollToBottomEnabled){
          this.previousScrollTop = scrollableDiv.scrollTop;
          console.log(this.previousScrollTop);
          
        scrollableDiv.scroll({ top: scrollableDiv.scrollHeight, behavior: 'smooth' });
        console.log('Scroll height:', scrollableDiv.scrollHeight);
        }
      },100)
  }

  //* create a div at coorddiante on right click.
   //? we create an object that contains coordinates
   menuTopLeftPosition =  {x: 0, y: 0}
   // reference to the MatMenuTrigger in the DOM
   @ViewChild(MatMenuTrigger, {static: true}) 
   matMenuTrigger!: MatMenuTrigger;

   onRightClick(event: MouseEvent, item: any) {
    //? preventDefault avoids to show the visualization of the right-click menu of the browser
    event.preventDefault();
    //* we record the mouse position in our object
    this.menuTopLeftPosition.x = event.clientX;
    this.menuTopLeftPosition.y = event.clientY;
    //* we open the menu
    //* we pass to the menu the information about our object
    this.matMenuTrigger.menuData = {item: item}
    this.editDeleteMessage=item.id;
    console.log(this.editDeleteMessage);
    
    //* we open the menu
    this.matMenuTrigger.openMenu();
  }

  //*Edit the message.
  EditMessage(msgId:string,content:string){
    const editMessageValue: editMessage = { content: content };
    console.log(editMessageValue);
    this.service.editMessage(msgId, editMessageValue).subscribe(result=>{
      console.log(result);
      this._hubConnection.invoke('EditMessage', result);
      const editedMsgIndex = this.msgList.findIndex(msg => msg.id === msgId);
      if (editedMsgIndex !== -1) {
        this.msgList[editedMsgIndex].msgBody = result.msgBody;
        this.msgList = [...this.msgList];
        console.log(editMessageValue.content);
      }
    })
  } 

  //* Delete the message.
  DeleteMessage(msg:userMessage){
    this.service.deleteMessage(this.editDeleteMessage).subscribe(result=>{
      console.log(result)
      if(!result){
        this.errorMessage='Some error, Please Try again.'
      }
      this._hubConnection.invoke('DeleteMessage', msg);

      const indexToRemove = this.msgList.findIndex(item => item.id === msg.id);
      console.log(indexToRemove);
      if (indexToRemove !== -1) {
        this.msgList.splice(indexToRemove, 1); 
      }
    })
  }

  //* Search the messages.
  searchMessage(query:string){
    this.SearchMessage.query=this.searchform.get('query')?.value;
    console.log(this.SearchMessage);
    
      this.isUserMessage = false;
      this.service.searchMessages(query).subscribe((result:any) =>{
      console.log(result);
      this.searchData=result;
      console.log(this.searchData);
      setTimeout(() => {
        this.searchform.reset();
      }, 500);
    })
  }

  shiftToSearch(){
    // if (this.searchform.dirty && this.searchform.touched && this.searchform.invalid) {
      this.isUserMessage = true;
  }
  
  handleFormClick(event: MouseEvent): void {
    event.stopPropagation();
  }
  logout(){
    this.service.logout().subscribe((result)=>{
      console.log(result);
      this.router.navigate(["/login"]);
    });
  }
}
