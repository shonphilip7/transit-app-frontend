import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFooter, IonCol, IonGrid, IonRow, IonImg } from '@ionic/angular/standalone';
import { StorageServices } from '../services/storage-services';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';
import { Trainview } from '../services/trainview';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFooter, 
    IonCol, IonGrid, IonRow, IonImg, DatePipe
  ],
})
export class Tab1Page {
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private AUTH_TOKEN_VALUE: boolean | null = null;
  private apiSubscription: Subscription | undefined;
  public today = Date.now();
  trips: any[] = [];
  inbound_trips: any[] = [];
  outbound_trips: any[] = [];
  errorMessage: string = '';
  station_name: string = '';

  constructor(private storageService: StorageServices, private authService: Auth, private router: Router, private trainViewService: Trainview) {}
  
  ngOnInit() {
    this.loadData();
  }
  
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

  loadData() {
    this.apiSubscription = this.trainViewService.getTrainView().subscribe({
      next: (data) => {
          this.trips = data;
          for (const trip of Object.values(this.trips)) {
            this.inbound_trips = trip.Inbound;
            this.outbound_trips = trip.Outbound;
          }
          this.station_name = this.inbound_trips[0].stop_name;
        },
      error: (error) => {
          this.errorMessage = 'Failed to fetch data';
          console.error('Error:', error);
        }
    });
  }

  ngOnDestroy() {
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }
  }
}
