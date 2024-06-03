import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy, Renderer2 } from '@angular/core';
import { WeatherApiService } from '../../services/weather-api/weather-api.service';
import { UtilityService } from '../../services/utility/utility.service';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css']
})
export class CurrentWeatherComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;

  currentWeatherData: any;
  backgroundVideo!: string;
  isVideoPlaying: boolean = false;

  private handleUserInteractionBound: () => void;

  constructor(
    private weatherApiService: WeatherApiService,
    private utilityService: UtilityService,
    private renderer: Renderer2
  ) {
    this.handleUserInteractionBound = this.handleUserInteraction.bind(this);
  }

  ngOnInit(): void {
    this.utilityService.getCoords().subscribe(coords => {
      if (coords) {
        this.updateWeather(coords.lat, coords.lon);
      }
    });
  }

  ngAfterViewInit(): void {
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    window.addEventListener('focus', this.handleWindowFocus.bind(this));

    this.renderer.listen('window', 'click', this.handleUserInteractionBound);
  }

  ngOnDestroy(): void {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    window.removeEventListener('focus', this.handleWindowFocus.bind(this));
    window.removeEventListener('click', this.handleUserInteractionBound);
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

      setTimeout(() => {
        this.loadAndPlayVideo();
      }, 0);
    });
  }

  handleUserInteraction(): void {
    if (!this.isVideoPlaying) {
      this.loadAndPlayVideo();
    }
  }

  loadAndPlayVideo(): void {
    if (this.videoElement) {
      const video: HTMLVideoElement = this.videoElement.nativeElement;
      video.src = 'assets/img/animations/' + this.backgroundVideo;
      video.load();

      video.oncanplaythrough = () => {
        video.play().then(() => {
          this.isVideoPlaying = true;
        }).catch(error => {
          console.error('Error attempting to play video:', error);
        });
      };
    }
  }

  handleVisibilityChange(): void {
    if (document.visibilityState === 'visible' && !this.isVideoPlaying) {
      this.loadAndPlayVideo();
    }
  }

  handleWindowFocus(): void {
    if (!this.isVideoPlaying) {
      this.loadAndPlayVideo();
    }
  }
}
