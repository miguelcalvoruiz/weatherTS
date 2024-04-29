import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherApiService {

  private apiKey = '7d3fe649c8b8c8d3615e21ef94ebb141';
  private apiUrl = 'https://api.openweathermap.org/data/2.5';
  private apiURLGeo = 'https://api.openweathermap.org/geo/1.0';

  constructor(private http: HttpClient) { }

  fetchData(URL: string): Observable<any> {
    return new Observable(observer => {
      fetch(`${URL}&appid=${this.apiKey}`)
        .then(response => response.json())
        .then(data => {
          observer.next(data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  getCurrentWeather(lat: number, lon: number): string {
    return `${this.apiUrl}/weather?lat=${lat}&lon=${lon}&units=metric`;
  }

  getForecast(lat: number, lon: number): string {
    return `${this.apiUrl}/forecast?lat=${lat}&lon=${lon}&units=metric`;
  }

  getAirPollution(lat: number, lon: number): string {
    return `${this.apiUrl}/air_pollution?lat=${lat}&lon=${lon}`;
  }

  getReverseGeo(lat: number, lon: number): string {
    return `${this.apiURLGeo}/reverse?lat=${lat}&lon=${lon}&limit=5`;
  }

  getGeo(query: string): Observable<any> {
    const url = `${this.apiURLGeo}/direct?q=${query}&limit=5`;
    return this.fetchData(url);
  }
}
