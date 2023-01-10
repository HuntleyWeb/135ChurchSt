import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './content/home/home.component';
import { AboutComponent } from './content/about/about.component';
import { ContactComponent } from './content/contact/contact.component';
import { BookingComponent } from './content/booking/booking.component';
import { BookinginfoComponent } from './content/bookinginfo/bookinginfo.component';
import { FeedbackComponent } from './content/feedback/feedback.component';
import { PubsComponent } from './content/pubs/pubs.component';
import { ParkingComponent } from './content/parking/parking.component';

const routes: Routes = [
  { path : 'home', component: HomeComponent },
  { path : 'about', component: AboutComponent },
  { path : 'booking', component: BookingComponent },
  { path : 'bookinginfo', component: BookinginfoComponent },
  { path : 'contact', component: ContactComponent },
  { path : 'feedback', component: FeedbackComponent },
  { path : 'parking', component: ParkingComponent },
  { path : 'pubs', component: PubsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
