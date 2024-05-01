import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WeatherApiService {

  private apiKey = '7d3fe649c8b8c8d3615e21ef94ebb141';
  private apiUrl = 'https://api.openweathermap.org/data/2.5';
  private apiURLGeo = 'https://api.openweathermap.org/geo/1.0';


  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any) { }

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
