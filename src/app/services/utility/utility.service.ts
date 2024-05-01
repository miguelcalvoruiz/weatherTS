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

    return `${hours % 12 || 12}:${minutes} ${period}`;
  }

  getHours(timeUnix: number, timezone: number): string {
    const date = new Date((timeUnix + timezone) * 1000);
    const hours = date.getUTCHours();
    const period = hours >= 12 ? "PM" : "AM";

    return `${hours % 12 || 12} ${period}`;
  }

  mpsToKmh(mps: number): number {
    const mph = mps * 3600;
    return mph / 1000;
  }

  getApiText(level: number): { level: string, message: string } {
    return this.apiText[level] || { level: "", message: "" };
  }

  private apiText: { [key: number]: { level: string, message: string } } = {
    1: {
      level: "Good",
      message:
        "Air quality is considered satisfactory, and air pollution poses little or no risk",
    },
    2: {
      level: "Fair",
      message:
        "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.",
    },
    3: {
      level: "Moderate",
      message:
        "Members of sensitive groups may experience health effects. The general public is not likely to be affected.",
    },
    4: {
      level: "Poor",
      message:
        "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.",
    },
    5: {
      level: "Very Poor",
      message:
        "Health warnings of emergency conditions. The entire population is more likely to be affected.",
    },
  };

}
