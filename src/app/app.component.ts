import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private plt: Platform,
              private authService: AuthService,
              private router: Router,
              ) {
                this.initializeApp()
              }

  initializeApp(){
    this.plt.ready().then(()=> {
      this.authService.authenticationState.subscribe(state => {
        if(state) {
          this.router.navigate(['starter']);
        }else {
          this.router.navigate(['login']);
        }
      });

      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
    })
  }
}


