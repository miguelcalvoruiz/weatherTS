import { Component } from '@angular/core';
import { WeatherApiService } from '../../services/weather-api/weather-api.service';
import { UtilityService } from '../../services/utility/utility.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hourly-forecast',
  templateUrl: './hourly-forecast.component.html',
  styleUrl: './hourly-forecast.component.css'
})
export class HourlyForecastComponent {
  forecastList: any[] = [];
  lat: number | undefined;
  lon: number | undefined;

  constructor(
    private weatherApiService: WeatherApiService,
    private utilityService: UtilityService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.utilityService.getCoords().subscribe(coords => {
      if (coords) {
        this.updateForecast(coords.lat, coords.lon);
      }
    });
  }

  updateForecast(lat: number, lon: number): void {
    this.weatherApiService.getForecast(lat, lon).subscribe((forecast: any) => {
      const currentTime = new Date();
      const { list } = forecast;

      const futureForecasts = list.filter((data: any) => {
        const forecastTime = new Date(data.dt_txt);
        return forecastTime > currentTime;
      });

      this.forecastList = futureForecasts.slice(0, 8).map((data: any) => {
        const { dt_txt, main: { temp }, weather, wind: { deg: windDirection, speed: windSpeed } } = data;
        const [{ icon, description }] = weather;
        const dateTime = new Date(dt_txt);
        return {
          dateTime,
          temp,
          icon,
          description,
          windDirection,
          windSpeed
        };
      });
    });
  }

  mpsToKmh(mps: number): number {
    return this.utilityService.mpsToKmh(mps);
  }
}
