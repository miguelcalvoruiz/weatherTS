import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { WeatherApiService } from '../../services/weather-api/weather-api.service';
import { UtilityService } from '../../services/utility/utility.service';


interface WeatherVideos {
  Clear: string;
  Clouds: string;
  Rain: string;
  Drizzle: string;
  Thunderstorm: string;
  Snow: string;
  Mist: string;
  Smoke: string;
  Haze: string;
  Dust: string;
  Fog: string;
  Sand: string;
  Ash: string;
  Squall: string;
  Tornado: string;
  [key: string]: string;
}



@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css']
})
export class CurrentWeatherComponent implements OnInit {
  @ViewChild('animationContainer', { static: true }) animationContainer!: ElementRef;
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
      this.backgroundVideo = this.getBackgroundVideo(weatherCondition);
    });
  }

  getBackgroundVideo(weatherCondition: string): string {
    const videos: WeatherVideos = {
      Clear: 'clear-day.mp4',
      Clouds: 'cloudy.mp4',
      Rain: 'rainy.mp4',
      Drizzle: 'rainy.mp4',
      Thunderstorm: 'thunderstorm.mp4',
      Snow: 'snowy-day.mp4',
      Mist: 'haze.mp4',
      Smoke: 'haze.mp4',
      Haze: 'haze.mp4',
      Dust: 'dust.mp4',
      Fog: 'haze.mp4',
      Sand: 'haze.mp4',
      Ash: 'haze.mp4',
      Squall: 'rainy.mp4',
      Tornado: 'tornado.mp4'
      
    };
    return videos[weatherCondition] || 'cloudy.mp4';
  }
  
}
