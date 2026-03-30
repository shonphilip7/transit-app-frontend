import { Component } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButton, IonFooter, IonCol, IonGrid, IonRow,
  IonList, IonItem, IonSelect, IonSelectOption,
  IonLabel 
} from '@ionic/angular/standalone';
import { StorageServices } from '../services/storage-services';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';
import { Trainview } from '../services/trainview';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFooter, 
    IonCol, IonGrid, IonRow, DatePipe, ReactiveFormsModule, IonList, IonItem,
    IonSelect, IonSelectOption, CommonModule, IonLabel
  ],
})
export class Tab1Page {
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private AUTH_TOKEN_VALUE: boolean | null = null;
  private apiSubscription: Subscription | undefined;
  private routeSubscription: Subscription | undefined;
  public today = Date.now();
  trips: any[] = [];
  inbound_trips: any[] = [];
  outbound_trips: any[] = [];
  errorMessage: string = '';
  station_name: string = '';
  public route_items: any[] = [];
  trainViewForm: FormGroup;
  // Initialize the boolean to true to show the form initially
  showForm: boolean = true;

  constructor(
    private storageService: StorageServices, 
    private authService: Auth, 
    private router: Router, 
    private trainViewService: Trainview, 
    private fb: FormBuilder
  ) {
    this.trainViewForm = this.fb.group({
      selectedRoute: ['', Validators.required]
    });
  }
  
  ngOnInit() {
    //this.loadData();
    this.fetchRoutes();
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

  // Function to check if a specific field has errors
  hasError(field: string, error: string) {
    return this.trainViewForm.get(field)?.hasError(error) && 
           (this.trainViewForm.get(field)?.touched || this.trainViewForm.get(field)?.dirty);
  }

  submitForm() {
    // Mark all fields as touched to display validation errors immediately
    this.trainViewForm.markAllAsTouched();
    if (this.trainViewForm.valid) {
      console.log('Form Submitted Successfully!', this.trainViewForm.value);
      // Hide the form after successful submission
      this.showForm = false;
      this.loadData();
    } else {
      console.log('Form is Invalid. Please select an option.');
    }
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
          this.errorMessage = 'Failed to fetch schedules';
          console.error('Error:', error);
        }
    });
  }

  fetchRoutes() {
    this.routeSubscription = this.trainViewService.getRoutes().subscribe({
      next: (data) => {
        this.route_items = data;
        console.log(this.route_items);
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch routes';
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
