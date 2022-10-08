import {
  SendMessageCommand,
  SendMessageCommandOutput,
  SQSClient
} from '@aws-sdk/client-sqs';

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
  public async sendSqsMessage(
    data: SqsParameters
  ): Promise<SendMessageCommandOutput> {
    const { source, title, payload, queueUrl } = data;
    const params = {
      DelaySeconds: 60,
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
      if (!data) {
        console.log('Did not get response from sending sqs message.');
      }
      console.log('Success, message sent. MessageID:', data.MessageId);
      return data;
    } catch (err: any) {
      console.error(
        'Failed to send message to the queue',
        err,
        'check payload',
        data
      );
      throw new Error(err);
    }
  }
}
