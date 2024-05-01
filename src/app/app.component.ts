import { Component, OnInit } from '@angular/core';
import { GeolocationService } from './services/geolocation/geolocation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private geolocationService: GeolocationService, private router: Router) {}

  ngOnInit(): void {
    this.geolocationService.getCurrentPosition().subscribe(
      (position: GeolocationPosition) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url = `/weather?lat=${lat}&lon=${lon}`;
        this.router.navigateByUrl(url);
      },
      error => {
        console.error('Error obteniendo la ubicación actual:', error);
      }
    );
  }

}
