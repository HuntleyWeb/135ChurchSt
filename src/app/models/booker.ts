export class Booker {
  constructor(
    public Name: string,
    public EmailAddress: string,
    public Mobile: string,
    public Cottage: string,
    public StartDate: Date,
    public EndDate: Date,
    public Created: Date)
  {
    this.Created = new Date();
  }
}
