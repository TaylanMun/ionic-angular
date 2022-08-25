import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
// import { Platform } from '@ionic/angular';
// import { SplashScreen } from '@capacitor/splash-screen';
// import { Capacitor } from '@capacitor/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  private previousAuthState = false;

  constructor(
    // private platform: Platform,
    private authService: AuthService,
    private router: Router
  ) {
    // this.initializeApp();
  }

  // initializeApp() {
  //   this.platform.ready().then(() => {
  //     if (Capacitor.isPluginAvailable('SplashScreen')) {
  //       console.log('sa');

  //       SplashScreen.hide();
  //     }
  //   });
  // }

  ngOnInit() {
    const authSub = this.authService.userIsAuthenticated.subscribe((isAuth) => {
      if (!isAuth && this.previousAuthState !== isAuth) {
        this.router.navigateByUrl('/auth');
      }
      this.previousAuthState = isAuth;
    });
  }

  onLogout() {
    this.authService.logout();
  }
  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
