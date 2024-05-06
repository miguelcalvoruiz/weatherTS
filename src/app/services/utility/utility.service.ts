import { Injectable } from '@angular/core';
import { TranslateService } from '../translate/translate.service';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  weekDayNames: string[] = [
    "label.days.sunday",
    "label.days.monday",
    "label.days.tuesday",
    "label.days.wednesday",
    "label.days.thursday",
    "label.days.friday",
    "label.days.saturday",
  ];

  monthNames: string[] = [
    "label.months.january",
    "label.months.february",
    "label.months.march",
    "label.months.april",
    "label.months.may",
    "label.months.june",
    "label.months.july",
    "label.months.august",
    "label.months.september",
    "label.months.october",
    "label.months.november",
    "label.months.december",
  ];

  constructor(private translateService: TranslateService) { }

  private translate(key: string): string {
    return this.translateService.getTranslate(key);
  }

  getDate(dateUnix: number, timezone: number): string {
    const date = new Date((dateUnix + timezone + new Date().getTimezoneOffset() * 60) * 1000);
    const weekDayName = this.translate(this.weekDayNames[date.getDay()]);
    const monthName = this.translate(this.monthNames[date.getMonth()]);
  
    return `${weekDayName} ${date.getDate()}, ${monthName}`;
  }  

  getTime(timeUnix: number, timezone: number): string {
    const date = new Date((timeUnix + timezone) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    
    const period = hours >= 12 ? "PM" : "AM";
    const formatedminutes = minutes < 10 ? '0' + minutes : minutes;

    return `${hours % 12 || 12}:${formatedminutes} ${period}`;
  }

  mpsToKmh(mps: number): number {
    const mph = mps * 3600;
    return mph / 1000;
  }

  getApiText(level: number): { level: string, message: string } {
    return this.apiText[level] || { level: "", message: "" };
  }

  public apiText: { [key: number]: { level: string, message: string } } = {
    1: {
      level: "label.utility.air.quality.level.good",
      message:
        "label.utility.air.quality.message.good",
    },
    2: {
      level: "label.utility.air.quality.level.fair",
      message:
        "label.utility.air.quality.message.fair",
    },
    3: {
      level: "label.utility.air.quality.level.moderate",
      message:
        "label.utility.air.quality.message.moderate",
    },
    4: {
      level: "label.utility.air.quality.level.poor",
      message:
        "label.utility.air.quality.message.poor",
    },
    5: {
      level: "label.utility.air.quality.level.very.poor",
      message:
        "label.utility.air.quality.message.very.poor",
    },
  };

}
