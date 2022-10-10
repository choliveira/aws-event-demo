import {
  SendMessageBatchCommand,
  SendMessageBatchCommandInput,
  SendMessageBatchRequestEntry,
  SendMessageCommand,
  SetQueueAttributesCommand,
  SQSClient
} from '@aws-sdk/client-sqs';
import { v4 as uuidv4 } from 'uuid';
// import { sqsClient } from '../utils/sqs';

export interface SqsParameters {
  source: string;
  payload: string;
  title: string;
  queueUrl?: string;
}

export class SqsService {
  private sqsClient: SQSClient;

  constructor() {
    this.sqsClient = new SQSClient({
      credentials: {
        accessKeyId: process.env.ACCESS_KEY!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!
      },
      region: 'ap-southeast-2'
    });
  }

  /**
   * sendBatchSqsMessage - send batch of (10 by default) messages to a SQS queue
   * @param input SendMessageBatchCommandInput
   * @return Promise<void>
   */
  public async sendBatchSqsMessage(
    input: SendMessageBatchCommandInput
  ): Promise<void> {
    console.log(
      '========== sendBatchSqsMessage INPUT ============',
      JSON.stringify(input)
    );
    try {
      const data = await this.sqsClient.send(
        new SendMessageBatchCommand(input)
      );
      console.log('========== batch sent ============', JSON.stringify(data));
    } catch (err) {
      console.error(
        'Failed to send batch message to the queue',
        err,
        'check payload',
        input
      );
    }
  }

  /**
   * setBatchMessagesAtt
   */
  public setBatchMessagesAtt(
    data: SqsParameters
  ): SendMessageBatchRequestEntry {
    const { source, title, payload } = data;
    return {
      Id: uuidv4(),
      DelaySeconds: 5,
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
      MessageBody: payload
    };
  }

  /**
   * sendSqsMessage
   */
  public async sendSqsMessage(data: SqsParameters): Promise<void> {
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
      QueueUrl: queueUrl
    };
    try {
      // await this.redriveDLQ();
      console.log('Will send message to sqs...', params);
      await this.sqsClient.send(new SendMessageCommand(params));

      // if (!data) {
      //   console.log('Did not get response from sending sqs message.');
      // }
      // console.log('Success, message sent. MessageID:', data.MessageId);
      // return data;
    } catch (err: any) {
      console.error(
        'Failed to send message to the queue',
        err,
        'check payload',
        data
      );
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
