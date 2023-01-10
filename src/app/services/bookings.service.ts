import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
//import { Observable, throwError } from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import { Booker } from '../models/booker';
import { Daterange } from '../models/daterange';
import { AppModule } from '../app.module';
import { Console } from 'console';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  private sendingBooking = new BehaviorSubject(false);
  sending = this.sendingBooking.asObservable();

  private BOOKINGS: Date[] = [
    new Date(2023, 0,  7),
      new Date(2023, 0, 14),
      new Date(2023, 0, 21),
      new Date(2023, 0, 28)
  ];

  baseUrl:string = environment.bookingApiEnpoint;

  constructor(private httpClient: HttpClient, private datePipe: DatePipe) { }

  AddDays(numOfDays: number, date = new Date()) {
    date.setDate(date.getDate() + numOfDays);

    return date;
  }

  BookingDeposit()
  {
    return environment.bookingDeposit;
  }

  ConvertToDate(date: NgbDate)
  {
      return new Date(date.year, date.month - 1, date.day);
  }

  ConvertStringToDate(date: string){

    const [day, month, year] = date.split('/');

    return new Date(+year, +month - 1, +day);
  }

  GetMinimumCalendarDate()
  {
    let currentDate = new Date();
    let startDate =  this.AddDays(7, currentDate);

    console.log(startDate);

    return new NgbDate (startDate.getFullYear(),  startDate.getMonth() +1, startDate.getDate());
  }

  GetMaximumCalendarDate()
  {
    let currentDate = new Date();
    let endDate =  this.AddDays(366, currentDate);
    console.log(endDate.getFullYear());

    return new NgbDate (endDate.getFullYear(),  endDate.getMonth() + 1, endDate.getDate());
  }

  GetMockedBookings() : Date[]{
    return this.BOOKINGS;
  }

  GetBookingDates() : Observable<any> {
    let minDate = this.GetMinimumCalendarDate();
    let endpoint = "/getBookingDates";

    endpoint += "?month=" + minDate.month + "&year=" + minDate.year;

    return this.httpClient.get(this.baseUrl + endpoint);
  }

  GetBookingRate(startDate:Date, duration)
  {
    let endpoint = "https://hwebapi.azurewebsites.net/BookingRate/getBookingRateByStartDate";

    endpoint += "?date=" + this.datePipe.transform(startDate, 'yyyy-MM-dd');
    endpoint += "&duration=" + duration;

    return this.httpClient.get(endpoint);
  }

  PostBooking(booking:Booker) : Observable<any> {

    //let endpoint = "https://reqres.in/api/posts";
    let endpoint = this.baseUrl + "/createBooking";

    let payload = JSON.stringify(booking);

    const headers = {'content-type':'application/json'};

    return this.httpClient.post(endpoint, payload, { 'headers': headers })
      .pipe(
        map((data) => {
          return data;
        }),
        catchError((err) => {
          console.error(err);
          throw err;
        })
      );
  }

  GetDayDifference(date1: Date, date2: Date)
  {
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

    var diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime())/(oneDay)));

    return diffDays;
  }

  GetWeekday(date: Date) {
    let weekDay = '';

    switch (date.getDay()) {
      case 1:
        weekDay = 'Monday';
        break;

      case 2:
        weekDay = 'Tuesday';
        break;

      case 3:
        weekDay = 'Wednesday';
        break;

      case 4:
        weekDay = 'Thursday';
        break;

      case 5:
        weekDay = 'Friday';
        break;

      case 6:
        weekDay = 'Saturday';
        break;

      default:
        weekDay = 'Sunday';
        break;
    }

    return weekDay;
  }
}
