import { AccountService } from './../_services/account.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../_models/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {}
  
  //This is just to declare the variable and make it available for the Init
  //currentUser$: Observable<User>; we can reach for it directly from the service instead by setting it to public!
  
  constructor(public accountService: AccountService) { }

  ngOnInit(): void {
    
    //This does nothing except reference the original subscription and thereby making it available to us here!
    //We can get a hold of this parameter since it is public by default! Note that this is not a copy!
    //this.currentUser$ = this.accountService.currentUser$;
  }

  //Notice that this is only used if the user must actually log in!
  login() {
    this.accountService.login(this.model).subscribe(response => {
      console.log(response);      
    }, error => {
      console.log(error);
    })
  }

  logout() {
    this.accountService.logout();
  }
}