import { UtilityService } from './../../services/utility/utility.service';
import { Component, Input, OnInit } from '@angular/core';
import { WeatherApiService } from '../../services/weather-api/weather-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-five-days-forecast',
  templateUrl: './five-days-forecast.component.html',
  styleUrl: './five-days-forecast.component.css'
})
export class FiveDaysForecastComponent implements OnInit {
  forecasts: any[] = [];

  constructor(
    private weatherApiService: WeatherApiService,
    private utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.utilityService.getCoords().subscribe(coords => {
      if (coords) {
        this.updateForecast(coords.lat, coords.lon);
      }
    });
  }

  updateForecast(lat: number, lon: number): void {
    this.weatherApiService.getProcessedForecast(lat, lon).subscribe(
      processedData => {
        this.forecasts = processedData;
      },
      error => {
        console.error('Error al obtener los pronósticos:', error);
      }
    );
  }
}
