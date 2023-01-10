export class Message {
  constructor(
    public FromAddress: string,
    public TargetAddress: string,
    public Subject: string,
    public Content: string,
    public NotificationList: string,
    public BodyIsHtml: boolean
    ){
      this.BodyIsHtml = false;
    }
}
