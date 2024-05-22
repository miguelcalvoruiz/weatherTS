import { PlatformLocation, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  getCurrentPosition(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      if (isPlatformBrowser(this.platformId) && navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next(position);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      } else {
        observer.error('Geolocation not supported');
      }
    });
  }
}
