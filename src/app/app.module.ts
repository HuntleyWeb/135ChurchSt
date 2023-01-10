import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainMenuComponent } from './menus/main-menu/main-menu.component';
import { AboutComponent } from './content/about/about.component';
import { HomeComponent } from './content/home/home.component';
import { ContactComponent } from './content/contact/contact.component';
import { PubsComponent } from './content/pubs/pubs.component';
import { BookingComponent } from './content/booking/booking.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeedbackComponent } from './content/feedback/feedback.component';
import { ParkingComponent } from './content/parking/parking.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule
} from '@angular/material';
import { BookinginfoComponent } from './content/bookinginfo/bookinginfo.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    AboutComponent,
    HomeComponent,
    ContactComponent,
    PubsComponent,
    BookingComponent,
    FeedbackComponent,
    ParkingComponent,
    BookinginfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    NoopAnimationsModule,
    MatNativeDateModule,
    MatInputModule,
    MatDatepickerModule,
    BrowserAnimationsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
