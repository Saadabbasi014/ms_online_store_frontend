import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Address, User } from '../../shared/models/user';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.baseUrl;
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);

  login(values: any) {
    let params = new HttpParams();
    params = params.append('useCookies', true); 
    params = params.append('useSessionCookies', true); 
    return this.http.post<User>(this.baseUrl + 'login', values, { params });
  }

  register(values: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', values);
  }

  // getUserInfo() {
  //   return this.http.get<User>(this.baseUrl + 'account/user-info', { withCredentials: true }).subscribe({
  //     next: (user) =>{console.log("user =>", user), this.currentUser.set(user)},
  //     error: (error) => console.error('Error fetching user info:', error),
  //   });
  // }

  getUserInfo() {
    return this.http.get<User>(this.baseUrl + 'account/user-info').pipe(
      map((user: User) => {
        console.log("user =>", user);
        this.currentUser.set(user);
        return user;
      })
    );
  }


  logOut() {
    return this.http.post(this.baseUrl + 'account/logout', {}).subscribe({
      next: () => this.currentUser.set(null),
      error: (error) => console.error('Error logging out:', error),
    });
  }

  updateAddress(address: Address) {
    return this.http.put<User>(this.baseUrl + 'account/address', address).pipe(
      tap(() => {
        this.currentUser.update(user => {
          if(user) user.address = address;
          return user;
        })
      })
    )
  }

  getAuthStatus() {
    return this.http.get<{isAthenticated: boolean}>(this.baseUrl + 'account/auth-status');
  }
}
