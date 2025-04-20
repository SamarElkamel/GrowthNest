import { Component, EventEmitter, Output } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-address-picker',
  templateUrl: './address-picker.component.html',
  styleUrls: ['./address-picker.component.scss']
})
export class AddressPickerComponent {
  @Output() addressSelected = new EventEmitter<string>();
  selectedAddress: string = '';

  options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      })
    ],
    zoom: 13,
    center: L.latLng(36.8065, 10.1815) // Default to Tunis
  };

  marker: L.Marker | null = null;

  constructor(private http: HttpClient) {}

  onMapClick(event: any) {
    const { lat, lng } = event.latlng;

    // Add/move marker
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(event.target);
    }

    // Reverse geocode
    this.http.get<any>(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .subscribe(response => {
        this.selectedAddress = response.display_name;
        this.addressSelected.emit(this.selectedAddress);
      });
  }
}
