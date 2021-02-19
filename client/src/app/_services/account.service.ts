import { User } from './../_models/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'https://localhost:5001/api/';

  /* This is like a fake "subject" or task that simulates a task, but what it really is doing is just emitting from a buffer.
  If a new user subscribes to this buffer the old stored item or items will be emitted to that subscriber.
  If a new value is tored in the buffer it will emit this to all subscribers. This is a way to reduce the amount of database
  requests if it's just the same request being made over and over again. */
  private currentUserSource = new ReplaySubject<User>(1);

  //We are here making any changes to currentUserSource into a susbscibeable event.
  //That means that it is currentUser$ you would subscribe to, but notice that this is not something that has a end (such as a HTTP request)
  //Because of this it is very important to unsubscribe from any subscription once the need is no longer there.
  //Note that this parameter is public by default!
  currentUser$ = this.currentUserSource.asObservable();

  //We inject our database calling tool into this object so that we can make us of it
  //Not that other than this nothing is done automatically here.
  constructor(private http: HttpClient) { }

  register(model: any) {
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }

  //We here try to login with the information that the user filled into the form, which in turn is stored in "model"
  login(model: any) {

    //We send the model in a post request to https://localhost:5001/api/account/login.
    //We also attach a RxJS pipe to enable us to react to response we get from our API
    return this.http.post(this.baseUrl + 'account/login', model)
    .pipe(

      //This is a RxJS method that needs to be imported from their library
      //We know that we will get a response and that this response will be our UserDto
      map((response: User) => {

        const user = response;
        if (user) {

          //First of all we save this response in our local database-pretend-call-buffer to avoid unnecessary calls
          this.currentUserSource.next(user);

          //We also save our response into a more "long term storage" that we remain if we refresh our browser or even close it and open it up a few days later.
          //Note that this only will be called if the user actually needs to login, which means that our more short term storage above didn't have the user.
          localStorage.setItem('user', JSON.stringify(user));
        }
      })
    )
  }

  //Just a helper method we can use to update the stored user
  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
