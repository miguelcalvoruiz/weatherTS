import { Component, OnInit } from '@angular/core';
import { WeatherApiService } from '../../services/weather-api/weather-api.service';
import { UtilityService } from '../../services/utility/utility.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-five-days-forecast',
  templateUrl: './five-days-forecast.component.html',
  styleUrl: './five-days-forecast.component.css'
})
export class FiveDaysForecastComponent implements OnInit {
  forecasts: any[] = [];
  lat!: number;
  lon!: number;

  constructor(
    private weatherApiService: WeatherApiService, 
    private utilityService: UtilityService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.lat = parseFloat(params['lat']);
      this.lon = parseFloat(params['lon']);

      if (!isNaN(this.lat) && !isNaN(this.lon)) {
        this.updateForecast(this.lat, this.lon);
      } else {
        console.error('Coordenadas no válidas en la URL');
      }
    });
  }

  updateForecast(lat: number, lon: number): void {
    this.weatherApiService.getProcessedForecast(lat, lon).subscribe(
      processedData => {
        this.forecasts = processedData;
        console.log(this.forecasts);
        
      },
      error => {
        console.error('Error al obtener los pronósticos:', error);
      }
    );
  }
}
