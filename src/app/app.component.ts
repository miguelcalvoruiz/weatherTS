import { UtilityService } from './services/utility/utility.service';
import { Component, OnInit } from '@angular/core';
import { GeolocationService } from './services/geolocation/geolocation.service';
import { ActivatedRoute, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  lat!: number;
  lon!: number;

  loading: boolean = true;
  minimumSpinnerDisplayTime = 1000;
  lastNavigationStart!: number;

  constructor(
    private geolocationService: GeolocationService,
    private router: Router,
    private route: ActivatedRoute,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.geolocationService.getCurrentPosition().subscribe(
      (position: GeolocationPosition) => {
        const latCurrent = position.coords.latitude;
        const lonCurrent = position.coords.longitude;
        const url = `/weather?lat=${latCurrent}&lon=${lonCurrent}`;
        this.router.navigateByUrl(url);
      },
      error => {
        console.error('Error obteniendo la ubicación actual:', error);
      }
    );

    this.route.queryParams.subscribe(params => {
      const lat = parseFloat(params['lat']);
      const lon = parseFloat(params['lon']);
      this.utilityService.setCoords(lat, lon);
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
        this.lastNavigationStart = Date.now();
      }

      if (event instanceof NavigationEnd || event instanceof NavigationError || event instanceof NavigationCancel) {
        const navigationTime = Date.now() - this.lastNavigationStart;
        const delay = Math.max(this.minimumSpinnerDisplayTime - navigationTime, 0);

        setTimeout(() => {
          this.loading = false;
        }, delay);
      }
    });
  }
}
