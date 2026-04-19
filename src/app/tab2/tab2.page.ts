import { AfterViewInit, Component } from '@angular/core';
import { IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonItem, 
  IonSelect,
  IonSelectOption } from '@ionic/angular/standalone';
import * as L from 'leaflet';
import { Map } from '../services/map';
import { Subscription } from 'rxjs';
import { Trainview } from '../services/trainview';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonItem, 
    IonSelect,
    IonSelectOption,
    CommonModule]
})
export class Tab2Page implements AfterViewInit {
  private map!: L.Map;
  private apiSubscription: Subscription | undefined;
  errorMessage: string = '';
  public route_items: any[] = [];
  private routeSubscription: Subscription | undefined;

  constructor(private mapService: Map, private trainViewService: Trainview) {}

  ngAfterViewInit() {
    this.fetchRoutes();
    this.initializeMap();
  }

  private initializeMap() {
    this.map = L.map('map', {
      center: [ 9.99432, 76.291689 ], // Initial map center
      zoom: 11, // Initial zoom level
      preferCanvas: true // Use canvas rendering for better performance
    });
    L.tileLayer('http://localhost:8080/tiles/{z}/{x}/{y}.png', {
      minZoom: 9,
      maxZoom: 15,
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(this.map);
    /*this.apiSubscription = this.mapService.getCoordinates().subscribe({
      next: (data) => {
        // Get lat lons from the API and add it to the map to show the route 
        var pointsForLineAndMarkers: any[] = [];
        data.forEach(function(element){
          pointsForLineAndMarkers.push([element.lat, element.lng]);
        });
        // Add the polyline to the map
        var polyline = L.polyline(pointsForLineAndMarkers, {color: '#000000'}).addTo(this.map);
        // Zoom the map to fit the polyline's bounds
        //this.map.fitBounds(polyline.getBounds());
        //Get the geographical bounds of your polyline
        var bounds = polyline.getBounds();
        // Get the calculated zoom level that fits these bounds
        // The second argument, `false`, means it finds the max zoom where the bounds fit *within* the view
        // If you want the map view to fit *into* the bounds, set it to `true`.
        var zoomLevel = this.map.getBoundsZoom(bounds, false);
        // Adjust the zoom level as needed the calculated zoom level is 9, so switched to 12
        var customZoomLevel = zoomLevel + 3;
        // Set the map's view and zoom to the center of the bounds and the custom zoom level
        this.map.setView(bounds.getCenter(), customZoomLevel);
      },
      error: (error) => {
          this.errorMessage = 'Failed to fetch data';
          console.error('Error:', error);
      }
    });*/
  }

  addMarkers(value: string) {
    this.apiSubscription = this.mapService.getCoordinates(value).subscribe({
      next: (data) => {
        // Get lat lons from the API and add it to the map to show the route 
        var pointsForLineAndMarkers: any[] = [];
        data.forEach(function(element){
          pointsForLineAndMarkers.push([element.lat, element.lng]);
        });
        // Add the polyline to the map
        var polyline = L.polyline(pointsForLineAndMarkers, {color: '#000000'}).addTo(this.map);
        // Zoom the map to fit the polyline's bounds
        //this.map.fitBounds(polyline.getBounds());
        //Get the geographical bounds of your polyline
        var bounds = polyline.getBounds();
        // Get the calculated zoom level that fits these bounds
        // The second argument, `false`, means it finds the max zoom where the bounds fit *within* the view
        // If you want the map view to fit *into* the bounds, set it to `true`.
        var zoomLevel = this.map.getBoundsZoom(bounds, false);
        /**
         * Adjust the zoom level as needed the ex: if calculated zoom level is 9 and you need
         * to switch to 12 change to zoomLevel + 3
         */
        var customZoomLevel = zoomLevel;
        // Set the map's view and zoom to the center of the bounds and the custom zoom level
        this.map.setView(bounds.getCenter(), customZoomLevel);
      },
      error: (error) => {
          this.errorMessage = 'Failed to fetch data';
          console.error('Error:', error);
      }
    });
  }

  onSelectionRoute(event: any) {
    const selectedValue = event.detail.value;
    console.log(selectedValue);
    if (selectedValue !== undefined) {
      this.addMarkers(selectedValue);
    }
  }

  /**
   * Fires after a page has fully transitioned into view and become the active page
  */
  ionViewDidEnter() {
    // Invalidate the map size to ensure all tiles load correctly after Ionic transitions
    if (this.map) {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 500); // A small timeout can help with rendering issues
    }
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
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
