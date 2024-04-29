import { Component, OnInit } from '@angular/core';
import { WeatherApiService } from '../../services/weather-api/weather-api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  searchTerm: string = '';
  searchResults: any[] = [];
  searching: boolean = false;
  searchTimeout: any;

  constructor(private weatherApiService: WeatherApiService) { }

  ngOnInit(): void {
  }

  search(): void {
    clearTimeout(this.searchTimeout);
    if (!this.searchTerm) {
      this.clearSearchResults();
      return;
    }

    this.searching = true;
    this.searchTimeout = setTimeout(() => {
      this.weatherApiService.getGeo(this.searchTerm)?.subscribe((locations: any[]) => {
        this.searchResults = locations;
      });
    }, 50);
  }

  clearSearchResults(): void {
    if (!this.searchTerm) {
      this.searchResults = [];
      this.searching = false;
    }
  }
}
