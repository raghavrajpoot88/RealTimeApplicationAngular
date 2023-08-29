import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { logs } from '../model/userInfo';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  selectedTimeInterval: number = 5;
  
  logs:logs[]=[];
  
  constructor(private service:UserService ){}
  ngOnInit(): void {
    
    this.requestLogs();
  }

  requestLogs(){
    this.service.requestLogsData(this.selectedTimeInterval).subscribe(result =>{
      console.log(result);
      this.logs=result;
      console.log(this.logs);
    })
  }
}
