import {
  SendMessageCommand,
  SendMessageCommandOutput,
  SetQueueAttributesCommand,
  SQSClient
} from '@aws-sdk/client-sqs';

export interface SqsParameters {
  source: string;
  payload: string;
  title: string;
  queueUrl: string;
}

export class SqsService {
  private sqsClient: SQSClient;

  constructor() {
    this.sqsClient = new SQSClient({ region: 'ap-southeast-2' });
  }

  /**
   * sendSqsMessage
   */
  public async sendSqsMessage(
    data: SqsParameters
  ): Promise<SendMessageCommandOutput> {
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
      await this.redriveDLQ();
      console.log('Will send message to sqs...', params);
      const data = await this.sqsClient.send(new SendMessageCommand(params));
      if (!data) {
        console.log('Did not get response from sending sqs message.');
      }
      console.log('Success, message sent. MessageID:', data.MessageId);
      return data;
    } catch (err: any) {
      console.log(
        'Failed to send message to the queue',
        err,
        'check payload',
        data
      );
      throw new Error(err);
    }
  }

  private async redriveDLQ(): Promise<void> {
    const params = {
      Attributes: {
        RedrivePolicy:
          '{"deadLetterTargetArn":"arn:aws:sqs:ap-southeast-2:587919987702:dlq-process-order-created",' +
          '"maxReceiveCount":"10"}' //DEAD_LETTER_QUEUE_ARN
      },
      QueueUrl:
        'https://sqs.ap-southeast-2.amazonaws.com/587919987702/dlq-process-order-created' //SQS_QUEUE_URL
    };
    try {
      console.log('Will set attributes to redriveDLQ');
      const data = await this.sqsClient.send(
        new SetQueueAttributesCommand(params)
      );
      console.log('redriveDLQ Success', data);
    } catch (err: any) {
      console.log('Error in the method redriveDLQ', err);
      throw new Error(err);
    }
  }
}
