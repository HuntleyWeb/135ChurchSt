import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Contact } from '../models/contact';
import { Message } from '../models/message';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private sendingEmail = new BehaviorSubject(false);
  sending = this.sendingEmail.asObservable();

  private messageSent = new BehaviorSubject(false);
  messageSuccessful = this.messageSent.asObservable();

  private onError = new BehaviorSubject('');
  messagingError = this.onError.asObservable();

  mailEndpoint = environment.mailApiEndpoint;
  contactTarget = environment.contactUsTarget;
  ccList = environment.notificationList;

  constructor(private httpClient: HttpClient) { }

  public async SendMessage(contactModel: Contact) {
    this.sendingEmail.next(true);
    this.messageSent.next(false);

    console.log('SendMessage() Called!' + contactModel.Name);

    const httpOptions = {
      headers: new HttpHeaders({
      'Content-Type': 'application/json'
      })
    };

    const payload = this.createPayload(contactModel);

    const promise = this.httpClient.post(this.mailEndpoint, payload, httpOptions)
        .toPromise();

    promise.then((response) => {
      console.log(response as JSON);

      this.sendingEmail.next(false);
      this.messageSent.next(true);

      // this.onError.next("Oh dear!");

    }).catch((error) => {
      this.handleHttpError('SendMessage()', error);
    });
  }

  handleHttpError(method: string, error: HttpErrorResponse)  {
    console.log('Method:' + method);
    console.log('Status Code:' + error.status);
    console.log('Details:' + error.message);

    if (error.status === 404)    {
      console.log('Service Not Available!');
    }

    this.sendingEmail.next(false);
    this.onError.next(error.message);
  }

  createPayload(contactModel: Contact)  {
    let content: string = 'New Message From: <b>' + contactModel.Name + '</b><br>';

    content += 'Message Category:' + contactModel.Category + '<br>';
    content += '<p>' + contactModel.Message + '</p><br>End of Message....';

    const subject1 = contactModel.Category + ' ' + contactModel.Subject + ' From:' + contactModel.Name;

    const msg = new Message(
      contactModel.EmailAddress,
      this.contactTarget,
      contactModel.Subject,
      content,
      this.ccList,
      false
    );

    return JSON.stringify(msg);
  }
}
