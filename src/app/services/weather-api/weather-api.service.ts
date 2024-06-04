import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherApiService {

  private apiKey = '7d3fe649c8b8c8d3615e21ef94ebb141';
  private apiUrl = 'https://api.openweathermap.org/data/2.5';
  private apiURLGeo = 'https://api.openweathermap.org/geo/1.0';


  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any,  private utilityService: UtilityService) { }

  fetchData(URL: string): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return new Observable(observer => {
        fetch(`${URL}&lang=${navigator.language.split('-')[0]}&appid=${this.apiKey}`)
          .then(response => response.json())
          .then(data => {
            observer.next(data);
            observer.complete();
          })
          .catch(error => {
            observer.error(error);
          });
      });
    } else {
      return new Observable(observer => {
        observer.error('navigator is not available');
      });
    }
  }

  getCurrentWeather(lat: number, lon: number): Observable<any> {
    const url = `${this.apiUrl}/weather?lat=${lat}&lon=${lon}&units=metric`;
    return this.fetchData(url);
  }

  getForecast(lat: number, lon: number): Observable<any> {
    const url = `${this.apiUrl}/forecast?lat=${lat}&lon=${lon}&units=metric`;
    return this.fetchData(url);
  }

  getProcessedForecast(lat: number, lon: number): Observable<any> {
    return this.getForecast(lat, lon).pipe(
      map(data => {
        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours(), 0, 0, 0);
        const currentHour = currentDate.getHours();

        const nextFiveDays = new Array(5).fill(null).map((_, index) => {
          const nextDate = new Date(currentDate);
          nextDate.setDate(currentDate.getDate() + index + 1);
          return nextDate.toISOString().split('T')[0];
        });

        const processedForecasts = nextFiveDays.map(date => {
          const dayForecasts = data.list.filter((forecast: any) => forecast.dt_txt.startsWith(date));

          if (dayForecasts.length > 0) {
            const closestForecast = dayForecasts.reduce((prev: any, curr: any) => {
              const prevHour = new Date(prev.dt_txt).getHours();
              const currHour = new Date(curr.dt_txt).getHours();
              return Math.abs(currHour - currentHour) < Math.abs(prevHour - currentHour) ? curr : prev;
            });

            const { main: { temp_max }, weather } = closestForecast;
            const [{ icon, description }] = weather;
            const forecastDate = new Date(closestForecast.dt_txt);
            const dayOfWeek = this.utilityService.weekDayNames[forecastDate.getUTCDay()];

            return {
              temp_max,
              icon,
              description,
              date: forecastDate,
              dayOfWeek
            };
          }

          return null;
        }).filter((forecast: any) => forecast !== null);
        return processedForecasts;
      })
    );
  }

  getAirPollution(lat: number, lon: number): Observable<any> {
    const url = `${this.apiUrl}/air_pollution?lat=${lat}&lon=${lon}`;
    return this.fetchData(url);
  }

  getReverseGeo(lat: number, lon: number): string {
    return `${this.apiURLGeo}/reverse?lat=${lat}&lon=${lon}&limit=5`;
  }

  getGeo(query: string): Observable<any> {
    const url = `${this.apiURLGeo}/direct?q=${query}&limit=5`;
    return this.fetchData(url);
  }
}
