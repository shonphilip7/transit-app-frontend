import { Component } from '@angular/core';
import { IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonFooter,
  IonButton } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { StorageServices } from '../services/storage-services';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    ExploreContainerComponent, 
    IonFooter,
    IonButton],
})
export class Tab3Page {
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private AUTH_TOKEN_VALUE: boolean | null = null;
  constructor(
    private storageService: StorageServices,
    private authService: Auth,
    private router: Router
  ) {}
  async logUserOut() {
    this.AUTH_TOKEN_VALUE = await this.authService.isLoggedIn();
    this.authService.logout(this.AUTH_TOKEN_VALUE).subscribe({
      next: async (response) => {
        console.log(response);
        await this.storageService.remove(this.AUTH_TOKEN_KEY);
        this.router.navigateByUrl('/login');
      },
      error: async (error) => {
        console.error('Logout failed', error);
        await this.storageService.remove(this.AUTH_TOKEN_KEY);
        this.router.navigateByUrl('/login');
      }
    });
  }
}
