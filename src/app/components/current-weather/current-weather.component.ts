import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { WeatherApiService } from '../../services/weather-api/weather-api.service';
import { UtilityService } from '../../services/utility/utility.service';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css']
})
export class CurrentWeatherComponent implements OnInit {
  currentWeatherData: any;
  backgroundVideo!: string;

  constructor(
    private weatherApiService: WeatherApiService,
    private utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.utilityService.getCoords().subscribe(coords => {
      if (coords) {
        this.updateWeather(coords.lat, coords.lon);
      }
    });
  }

  updateWeather(lat: number, lon: number): void {
    this.weatherApiService.getCurrentWeather(lat, lon).subscribe((data: any) => {
      this.currentWeatherData = {
        name: data.name,
        temp: parseInt(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        date: this.utilityService.getDate(data.dt, data.timezone),
        location: `${data.name}, ${data.sys.country}`
      };
      const weatherCondition = data.weather[0].main;
      this.backgroundVideo = this.utilityService.getBackgroundVideo(weatherCondition);
    });
  }
}
