import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { WeatherApiService } from '../../services/weather-api/weather-api.service';
import { UtilityService } from '../../services/utility/utility.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css']
})
export class CurrentWeatherComponent implements OnInit {
  lat: number | undefined;
  lon: number | undefined;

  currentWeatherData: any;

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
        this.updateWeather(this.lat, this.lon);
      } else {
        console.error('Coordenadas no válidas en la URL');
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
    });
  }
}
