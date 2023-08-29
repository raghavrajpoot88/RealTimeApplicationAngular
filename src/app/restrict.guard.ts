// import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
// import { UserService } from './services/user.service';
// import { Injectable } from '@angular/core';

// @Injectable  
// ({ providedIn: 'root' })

// export class restrictGuard implements CanActivate{
//   constructor(private userservice :UserService ,private router: Router) { }

//   canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot):boolean
//   {
//     if(this.userservice.isAuthenticated()) return true;
//     else{
//       this.router.navigate(["login"]);
//       return false;
//     }
//   }
// };
