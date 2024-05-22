import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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
        const forecastTimes = [0, 3, 6, 9, 12, 15, 18, 21];

        const nextFiveDays = new Array(5).fill(null).map((_, index) => {
          const nextDate = new Date(currentDate);
          nextDate.setDate(currentDate.getDate() + index + 1);
          return nextDate.toISOString().split('T')[0];
        });

        const uniqueDates: Set<string> = new Set();
        const processedForecasts = data.list.reduce((acc: any[], forecast: any) => {
          const forecastDate = forecast.dt_txt.split(' ')[0];
          if (nextFiveDays.includes(forecastDate) && !uniqueDates.has(forecastDate)) {
            uniqueDates.add(forecastDate);

            const closestForecastTime = forecastTimes.reduce((prev, curr) => {
              return (Math.abs(curr - currentDate.getHours()) < Math.abs(prev - currentDate.getHours()) ? curr : prev);
            });
            const forecastDateTime = new Date(forecast.dt_txt);
            forecastDateTime.setHours(closestForecastTime, 0, 0, 0);

            if (forecastDateTime.getTime() >= currentDate.getTime()) {
              const { main: { temp_max }, weather } = forecast;
              const [{ icon, description }] = weather;
              const dayOfWeek = this.utilityService.weekDayNames[forecastDateTime.getUTCDay()];
              acc.push({
                temp_max,
                icon,
                description,
                date: forecastDateTime,
                dayOfWeek
              });
            }
          }
          return acc;
        }, []);

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
