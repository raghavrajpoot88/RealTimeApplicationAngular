import { Expansion } from "@angular/compiler";

export interface userInfo
{
    emailAddress:string|null,
    userName:string|null,
    password:string|null,
    appName:string
}
export interface loginInfo{
    Email:string,
    Password:string,
    token:any,
}
export interface LoginValues{
    userNameOrEmailAddress:string,
    password:string,
    
}
export interface GoogleUserRequest {
    idToken: string;
}
export interface userList{
    id: string,
    email: string,
    userName: string,
    creationTime:string,
    creatorId:string,
    lastModificationTime:string,
    lastModifierId:string
}
export interface userMessage{
    id: string,
    senderId:string,
    receiverId: string,
    msgBody: string,
    timeStamp: string,
  
}
export interface sendMessage{
    ReceiverId:string,
    MsgBody:string,
}
export interface editMessage{
    content:string;
}
export interface logs{
    logId :string,
    clientIp :string,
    traceId :string,
    requestBody :string,
    requestDateTimeUtc :string,
    username :string,
}
export interface tokens{
    token:string
}