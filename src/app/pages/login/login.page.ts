import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonInput, AlertController } from '@ionic/angular/standalone';
import { Auth } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { StorageServices } from '../../services/storage-services';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonLabel, IonButton, IonInput, RouterModule]
})
export class LoginPage implements OnInit {

  email!: string;
  password!: string;
  loginCredentials = { email: '', password: '' };
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  constructor(public authService: Auth, private router: Router, private alertCtrl: AlertController, private storageService: StorageServices) {
  }
  async ngOnInit() {
    if (await this.authService.isLoggedIn() !== false) {
      this.router.navigateByUrl('');
    }
  }
  async login() {
    this.authService.login(this.loginCredentials).subscribe({
      next: async (response) => {
        console.log('Login successful', response.token);
        await this.storageService.set(this.AUTH_TOKEN_KEY, response.token);
        this.router.navigateByUrl('');
      },
      error: (error) => {
        console.error('Login failed', error);
        // Login failed, display an alert
        this.presentLoginFailedAlert(error.message || 'An unknown error occurred.');
      }
    });
    console.log('Attempting to log in with:', this.loginCredentials);
  }
  async presentLoginFailedAlert(errorMessage: string) {
    const alert = await this.alertCtrl.create({
      header: 'Login Failed',
      message: 'Please check your credentials. ' + errorMessage,
      buttons: ['OK']
    });
    await alert.present();
  }
}
