export class Contact {
  constructor(
    public Name: string,
    public EmailAddress: string,
    public Category: string,
    public Subject: string,
    public Message: string,
    public Created: Date)
  {
    this.Created = new Date();
  }
}
