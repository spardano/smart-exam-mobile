import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage'

export interface UserLogin {
  name: string;
  roles: string[];
}
const TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  api_url = environment.api_url;
  user;
  users:any = {};
  currentUser: BehaviorSubject<UserLogin> = new BehaviorSubject(null);
  authenticationState = new BehaviorSubject(false);

  constructor(private http: HttpClient,
              private helper: JwtHelperService,
              private storage: Storage,
              private alertCtrl: AlertController,
              private plt: Platform) { 
                this.plt.ready().then(() => {
                  this.checkToken();
                })
              }

  //cek token apakah token teridentifikasi atau expire
  checkToken() {
    this.storage.get(TOKEN_KEY).then(token => {
      if (token) {
        let decoded = this.helper.decodeToken(token);
        let isExpired = this.helper.isTokenExpired(token);

        if (!isExpired) {
          this.user = decoded;
          this.users = this.currentUser.getValue();
          this.authenticationState.next(true);
        } else {
          this.storage.remove(TOKEN_KEY);
        }
      }
    });
  }

  //login user
  login(credentials) {

    return this.http.post(`${this.api_url}/api/auth/login`, credentials)
      .pipe(
        tap(res => {
          if (res['error']) {
            this.showAlert(res['message'], 'Kesalahan');
          } else {
            this.storage.set(TOKEN_KEY, res['token']);
            this.user = this.helper.decodeToken(res['token']);
            this.currentUser.next(this.user);
            this.authenticationState.next(true);
          }

        }),
        catchError(e => {
          this.showAlert(e.error.message, 'Kesalahan');
          throw new Error(e);
        })
      );
  }

  //ambil data user 
  getUser() {
    return this.currentUser.getValue();
  }

  //method untuk menampilkan alert message
  showAlert(msg, header) {
    let alert = this.alertCtrl.create({
      message: msg,
      header: header,
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }

  //method untuk melakukan cek authentication
  isAuthenticated() {
    return this.authenticationState.value;
  }

  //logout user den remove token
  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
      //trying user roles
      this.currentUser.next(null);
    });
  }

    
}
