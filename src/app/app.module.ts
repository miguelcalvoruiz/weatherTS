import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslatePipe } from './pipes/translate.pipe';
import { TranslateService } from './services/translate/translate.service';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { CurrentWeatherComponent } from './components/current-weather/current-weather.component';
import { CapitalizeFirstWordPipe } from './pipes/capitalize-first-word.pipe';
import { FormsModule } from '@angular/forms';
import { FiveDaysForecastComponent } from './components/five-days-forecast/five-days-forecast.component';
import { ParseIntPipe } from './pipes/parse-int.pipe';
import { WeatherHighlightsComponent } from './components/weather-highlights/weather-highlights.component';
import { HourlyForecastComponent } from './components/hourly-forecast/hourly-forecast.component';

export function translateFactory(provider: TranslateService) {
  return () => provider.getData();
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TranslatePipe,
    CurrentWeatherComponent,
    CapitalizeFirstWordPipe,
    FiveDaysForecastComponent,
    ParseIntPipe,
    WeatherHighlightsComponent,
    HourlyForecastComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule 
  ],
  providers: [
    provideClientHydration(),
    TranslateService,
    {
      provide: APP_INITIALIZER,
      useFactory: translateFactory,
      deps: [TranslateService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
