import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { BookingsService } from '../../services/bookings.service';
import { Booker } from '../../models/booker';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  minDate: NgbDate;
  maxDate: NgbDate;
  hoveredDate: NgbDate | null = null;

	fromDate: NgbDate;
	toDate: NgbDate | null = null;

  rate = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  breakType = 'None';
  startDay = '';
  endDay = '';
  depositPct = '';
  depositAmount = '';
  balanceAmount = '';
  validDates = false;

  bookedDates: Date[];
  loading: boolean = false;
  errorMessage;

  model: Booker = null;
  sending = false;
  reserved = false;

  constructor(
    private bookingService: BookingsService,
    private router: Router,
    calendar: NgbCalendar) {

		//this.toDate = calendar.getNext(this.fromDate, 'd', 4);
  }

  ngOnInit() {
    //this.bookedDates = this.bookingService.GetMockedBookings();
    this.getBookingDates();
    this.depositPct = this.bookingService.GetBookingDepositPercent();
  }

  getBookingDates = () => {
    this.loading = true;
    this.errorMessage = "";

    this.bookingService.GetBookingDates()
      .subscribe(
        (response) => {
          this.mapDates(response);
          this.setCalendarRange();
        },
        (error) => {
          console.error('Request failed with error')
          this.errorMessage = error;
          this.loading = false;
        },
        () => {
          console.error('Request completed')
          this.loading = false;
        }
      );
  }

  getBookingRate = (starts:Date, duration) => {
    this.loading = true;
    this.errorMessage = "";

    this.bookingService.GetBookingRate(starts, duration)
      .subscribe(
        (response) => {
          this.rate = response.toString();
          this.depositAmount = this.bookingService.CalculateBookingDeposit(this.rate);
          this.balanceAmount = this.bookingService.CalculateBalance(this.rate, this.depositAmount);
        },
        (error) => {
          console.error('Request failed with error')
          //this.errorMessage = error;
          this.errorMessage = "No Booking Rate Configured... Please select alternative dates or contact us.";
          this.loading = false;
          this.validDates = false;
        },
        () => {
          console.error('Request completed')
          this.loading = false;
        }
      );
  }

  onSubmit = () => {
    this.sending = true;

    console.log('submitted form');

    this.bookingService.PostBooking(this.model)
      .subscribe(
        (response) => {
          console.log(response as JSON);
          this.handleBooking();
        },
        (error) => {
          console.error('Request failed with error')
          this.errorMessage = error.error;
          this.sending = false;
      },
      () => {
        console.error('Request completed')
        this.sending = false;
      });
  }

  mapDates (dates : string[]) {
    this.bookedDates = [];

    for(let i = 0; i < dates.length; i++)
    {
      var bookedDate = this.bookingService.ConvertStringToDate(dates[i]);

      this.bookedDates.push(bookedDate);
    }
  }

  setCalendarRange()
  {
    this.minDate = this.bookingService.GetMinimumCalendarDate();
    this.maxDate = this.bookingService.GetMaximumCalendarDate();
  }

  isMarkedDay (date: NgbDate) {
    var currentDate = new Date();

    var calendarDate = this.bookingService.ConvertToDate(date);

    return calendarDate == currentDate;
  }

  isDisabled=(date: NgbDate) => {
    let calendarDate = new Date(date.year, date.month - 1, date.day);

    if (this.bookedDates)
    {
      return this.bookedDates.find(x =>
        x.getDate() == calendarDate.getDate() &&
        x.getMonth() == calendarDate.getMonth() &&
        x.getFullYear() == calendarDate.getFullYear());
    }

    return false;
  }

  onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		}
    else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
			this.toDate = date;
      this.setSummary();
		}
    else {
			this.toDate = null;
			this.fromDate = date;
		}
	}

	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

  setSummary()
  {
    if (this.reserved)
      return;

    this.startDate = this.bookingService.ConvertToDate(this.fromDate);
    this.endDate = this.bookingService.ConvertToDate(this.toDate);

    let dayDiff = this.bookingService.GetDayDifference(this.endDate, this.startDate);

    this.breakType = this.getBreakType(dayDiff, this.startDate);

    this.startDay = this.bookingService.GetWeekday(this.startDate);
    this.endDay = this.bookingService.GetWeekday(this.endDate);

    if (this.validDates)
    {
      this.getBookingRate(this.startDate, dayDiff);
      this.model = new Booker('', '', '', '135aChurchStreet', this.startDate, this.endDate, new Date());
    }
  }

  resetForm()
  {
    this.model.Name = '';
    this.model.EmailAddress = '';
    this.model.Mobile = '';
  }

  handleBooking()
  {
    this.sending = false;
    this.reserved = true;
  }

  exitBooking()
  {
    this.router.navigate(['/bookinginfo']);
  }

  contact()
  {
    this.router.navigate(['/contact']);
  }

  getBreakType(days: number, startDate: Date)
  {
    var dayno = startDate.getDay();

    if (days == 4 && dayno == 1)
    {
      this.validDates = true;
      return "Mid-Week (4 nights)";
    }

    if (days == 3 && dayno == 5)
    {
      this.validDates = true;
      return "Weeked (3 nights)";
    }

    if (days == 7 && dayno == 6)
    {
      this.validDates = true;
      return "Full Week (7 nights)";
    }

    this.validDates = false;
    return "Non-standard, please contact us!"
  }
}
