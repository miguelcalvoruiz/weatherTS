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
  lat: number | undefined;
  lon: number | undefined;

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
    this.weatherApiService.getForecast(lat, lon).subscribe((data: any) => {
      const currentDate = new Date();
      const nextFiveDays = new Array(5).fill(null).map((_, index) => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + index + 1);
        return nextDate.toISOString().split('T')[0];
      });
  
      const uniqueDates: Set<string> = new Set();
      this.forecasts = data.list.reduce((acc: any[], forecast: any) => {
        const forecastDate = forecast.dt_txt.split(' ')[0];
        if (nextFiveDays.includes(forecastDate) && !uniqueDates.has(forecastDate)) {
          uniqueDates.add(forecastDate);
  
          const forecastTime = new Date(forecast.dt_txt).getTime() + (12 * 60 * 60 * 1000);
          const { main: { temp_max }, weather } = forecast;
          const [{ icon, description }] = weather;
          const dateObj = new Date(forecastTime);
          const dayOfWeek = this.utilityService.weekDayNames[dateObj.getUTCDay()];
  
          acc.push({
            temp_max,
            icon,
            description,
            date: dateObj,
            dayOfWeek
          });
        }
        return acc;
      }, []);
    });
  }
  
}
