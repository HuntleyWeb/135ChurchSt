import { Component, OnInit } from '@angular/core';
import { Contact } from '../../models/contact';
import { EmailService } from '../../services/emailservice.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private emailService: EmailService) { }

  telephone = '07841057610';
  sending = false;
  errDetails = '';
  categories = ['Make a Booking', 'General Enquiry', 'Booking Options'];
  model = new Contact('', '', '', '', '', new Date());
  submitted = false;
  successful = false;
  error = false;

  ngOnInit() {
    this.categories.sort();

    this.emailService.sending.subscribe(snd => this.sending = snd);
    this.emailService.messageSuccessful.subscribe(success => this.successful = success);
    this.emailService.messagingError.subscribe(err => this.onError(err));

    this.successful = false;
    this.error = false;
  }

  async onSubmit()
  {
    console.log('submitted form');
    this.successful = false;
    this.error = false;
    this.submitted = true;

    await this.emailService.SendMessage(this.model);

    console.log('***');
  }

  onError(error :string)
  {
    console.log('Messaging Error :' + error);
    this.successful = false;
    this.error = true;
  }

  resetForm()
  {
    this.model.Name = '';
    this.model.EmailAddress = '';
    this.model.Subject = '';
    this.model.Message = '';

    this.successful = false;
  }

  hideMe(div)
  {
    var box = document.getElementById(div);

    box.style.display = "none";
  }
}
