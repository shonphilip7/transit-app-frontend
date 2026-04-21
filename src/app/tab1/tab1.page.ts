import { Component, OnInit, OnDestroy } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButton, IonCol, IonGrid, IonRow,
  IonList, IonItem, IonSelect, IonSelectOption,
  IonLabel, IonButtons, IonIcon 
} from '@ionic/angular/standalone';
import { Trainview } from '../services/trainview';
import { timer, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
    IonCol, IonGrid, IonRow, DatePipe, ReactiveFormsModule, IonList, IonItem,
    IonSelect, IonSelectOption, CommonModule, IonLabel, IonButtons, IonIcon,
    RouterLink
  ],
})
export class Tab1Page implements OnInit, OnDestroy {
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private AUTH_TOKEN_VALUE: boolean | null = null;
  private apiSubscription: Subscription | undefined;
  private routeSubscription: Subscription | undefined;
  private stopsSubscription: Subscription | undefined;
  private timeSubscription: Subscription | undefined;
  private refreshSubscription: Subscription | undefined;
  public today = Date.now();
  trips: any[] = [];
  inbound_trips: any[] = [];
  outbound_trips: any[] = [];
  errorMessage: string = '';
  station_name: string = '';
  public route_items: any[] = [];
  public stop_items: any[] = [];
  trainViewForm: FormGroup;
  // Initialize the boolean to true to show the form initially
  showForm: boolean = true;

  constructor(
    private trainViewService: Trainview, 
    private fb: FormBuilder
  ) {
    this.trainViewForm = this.fb.group({
      selectedRoute: ['', Validators.required],
      selectedStop: ['', Validators.required]
    });
  }
  
  ngOnInit() {
    this.fetchRoutes();
    this.timeSubscription = timer(0, 60000).subscribe(() => {
      this.today = Date.now();
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
      this.loadData(this.trainViewForm.value.selectedRoute, this.trainViewForm.value.selectedStop);
      this.refreshSubscription = timer(60000,60000).subscribe(
        () => this.loadData(this.trainViewForm.value.selectedRoute, this.trainViewForm.value.selectedStop)
      );
    } else {
      console.log('Form is Invalid. Please select an option.');
    }
  }

  loadData(route: string, stop: string) {
    this.apiSubscription = this.trainViewService.getTrainView(route, stop).subscribe({
      next: (data) => {
          this.trips = data;
          console.log(this.trips);
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
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch routes';
        console.error('Error:', error);
      }
    });
  }

  fetchStops(value: string) {
    this.stopsSubscription = this.trainViewService.getStops(value).subscribe({
      next: (data) => {
        this.stop_items = data;
        console.log(this.stop_items);
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch routes';
        console.error('Error:', error);
      }
    });
  }

  onSelectionRoute(event: any) {
    const selectedValue = event.detail.value;
    this.fetchStops(selectedValue);
  }

  newSearch(event: any) {
    event.preventDefault();
    this.showForm = true;
  }

  ngOnDestroy() {
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.stopsSubscription) {
      this.stopsSubscription.unsubscribe();
    }
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}
