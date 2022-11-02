import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';

export interface IEmailData {
  to: [string];
  subject: string;
  body: string;
}

export class SesService {
  private region: string = 'ap-southeast-2';
  private sesClient: SESClient;
  private senderEmailAddress: string;

  constructor(sender: string = 'contact@carlosholiveira.com') {
    this.senderEmailAddress = sender;
    this.sesClient = new SESClient({
      credentials: {
        accessKeyId: process.env.ACCESS_KEY!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!
      },
      region: this.region
    });
  }

  public async sendEmail(emailData: IEmailData) {
    const emailCommand = this.SetEmailCommand(emailData);
    try {
      console.log('ses-service will send email', JSON.stringify(emailCommand));
      return await this.sesClient.send(emailCommand);
    } catch (e) {
      console.error('Failed to send email.', e, 'Email data:', emailCommand);
      return e;
    }
  }

  private SetEmailCommand(emailData: IEmailData): SendEmailCommand {
    return new SendEmailCommand({
      Destination: {
        /* required */
        CcAddresses: [
          /* more items */
        ],
        ToAddresses: emailData.to
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Html: {
            Charset: 'UTF-8',
            Data: emailData.body
          },
          Text: {
            Charset: 'UTF-8',
            Data: emailData.body
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: emailData.subject
        }
      },
      Source: this.senderEmailAddress,
      ReplyToAddresses: [
        /* more items */
      ]
    });
  }
}
