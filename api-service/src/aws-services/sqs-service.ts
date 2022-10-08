import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

export interface SqsParameters {
  source: string;
  payload: string;
  title: string;
  queueUrl: string;
}

export class SqsService {
  private region: string = 'ap-southeast-2';
  private sqsClient: SQSClient;

  constructor() {
    this.sqsClient = new SQSClient({ region: this.region });
  }

  /**
   * sendSqsMessage
   */
  public async sendSqsMessage(data: SqsParameters) {
    const { source, title, payload, queueUrl } = data;
    const params = {
      DelaySeconds: 10,
      MessageAttributes: {
        Title: {
          DataType: 'String',
          StringValue: title
        },
        Author: {
          DataType: 'String',
          StringValue: source
        },
        WeeksOn: {
          DataType: 'Number',
          StringValue: '6'
        }
      },
      MessageBody: payload,
      // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
      // MessageGroupId: "Group1",  // Required for FIFO queues
      QueueUrl: queueUrl
    };
    try {
      console.log('Will send message to sqs...', params);
      const data = await this.sqsClient.send(new SendMessageCommand(params));
      console.log('Success, message sent. MessageID:', data.MessageId);
    } catch (err) {
      console.error(
        'Failed to send message to the queue',
        err,
        'check payload',
        data
      );
    }
  }
}
