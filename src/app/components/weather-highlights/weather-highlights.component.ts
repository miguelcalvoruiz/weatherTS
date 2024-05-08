import { UtilityService } from './../../services/utility/utility.service';
import { Component, OnInit } from '@angular/core';
import { WeatherApiService } from '../../services/weather-api/weather-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-weather-highlights',
  templateUrl: './weather-highlights.component.html',
  styleUrls: ['./weather-highlights.component.css']
})
export class WeatherHighlightsComponent implements OnInit {
  highlightsData: any = null;
  sunriseTime: string = '';
  sunsetTime: string = '';
  feelsLike!: number;
  visibility!: number;
  pressure!: number;
  humidity!: number;
  lat!: number;
  lon!: number;

  constructor(
    private weatherApiService: WeatherApiService,
    public utilityService: UtilityService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.utilityService.getCoords().subscribe(coords => {
      if (coords) {
        this.updateHighlights(coords.lat, coords.lon);
      }
    });
  }

  updateHighlights(lat: number, lon: number): void {
    this.weatherApiService.getAirPollution(lat, lon).subscribe((airPollution: any) => {
      const {
        main: { aqi },
        components: { no2, o3, so2, pm2_5 }
      } = airPollution.list[0];

      this.highlightsData = {
        aqi,
        pm2_5: Number(pm2_5).toPrecision(2),
        so2: Number(so2).toPrecision(2),
        no2: Number(no2).toPrecision(3),
        o3: Number(o3).toPrecision(3)
      };

      this.weatherApiService.getCurrentWeather(lat, lon).subscribe((weatherData: any) => {
        this.sunriseTime = this.utilityService.getTime(weatherData.sys.sunrise, weatherData.timezone);
        this.sunsetTime = this.utilityService.getTime(weatherData.sys.sunset, weatherData.timezone);
        this.feelsLike = weatherData.main.feels_like;
        this.visibility = weatherData.visibility / 1000;
        this.pressure = weatherData.main.pressure;
        this.humidity = weatherData.main.humidity;
      });
    });
  }
}
