import { PublishBatchCommandInput } from '@aws-sdk/client-sns';
import {
  SendMessageBatchCommandInput,
  SendMessageBatchRequestEntry
} from '@aws-sdk/client-sqs';
import { DynamoDBRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { SnsService } from '../aws-services/sns-service';
import { SqsService } from '../aws-services/sqs-service';

export class OrderStreamController {
  private sqs: SqsService;
  private sns: SnsService;
  constructor() {
    this.sqs = new SqsService();
    this.sns = new SnsService();
  }

  /**
   * sqsProducer
   */
  public async sqsProducer(records: DynamoDBRecord[]): Promise<void> {
    console.log(
      'Im the sqsProducer and this is what I received from Order table stream.',
      JSON.stringify(records)
    );

    try {
      // const messages: SendMessageBatchRequestEntry[] = records.map(
      //   (r: DynamoDBRecord): any => {
      //     if (r.eventName === 'INSERT' && r.dynamodb && r.dynamodb.NewImage) {
      //       const order = DynamoDB.Converter.unmarshall(r.dynamodb.NewImage);
      //       return this.sqs.setBatchMessagesAtt({
      //         payload: JSON.stringify(order),
      //         source: 'order-stream-service',
      //         title: 'Order created'
      //       });
      //     }
      //   }
      // );

      // if (messages.length > 0) {
      //   const batch = {
      //     QueueUrl:
      //       'https://sqs.ap-southeast-2.amazonaws.com/587919987702/process-order-created',
      //     Entries: messages
      //   };
      //   await this.sqs.sendBatchSqsMessage(batch);
      // }
      await this.setBatch(records, 'sqs');
    } catch (err: any) {
      console.error(
        'Error happened on order-stream-controller at sqsProducer',
        JSON.stringify(err)
      );
    }
  }

  public async snsPublisher(records: DynamoDBRecord[]): Promise<void> {
    console.log(
      'Im the snsPublisher and I will send this data as a message payload to an SNS Topic.',
      records
    );
    try {
      await this.setBatch(records, 'sns');
    } catch (e) {
      console.error(
        'Error happened on order-stream-controller at snsPublisher',
        JSON.stringify(e)
      );
    }
  }

  public eventBusPublisher(data: any) {
    console.log(
      'Im the eventBusPublisher and I will send this data as a message payload to an SNS Topic.',
      data
    );
  }

  private async setBatch(records: DynamoDBRecord[], action: string) {
    const messages: SendMessageBatchRequestEntry[] = records.map(
      (r: DynamoDBRecord): any => {
        if (r.eventName === 'INSERT' && r.dynamodb && r.dynamodb.NewImage) {
          const order = DynamoDB.Converter.unmarshall(r.dynamodb.NewImage);
          return this.sqs.setBatchMessagesAtt({
            payload: JSON.stringify(order),
            source: 'order-stream-service',
            title: 'Order created'
          });
        }
      }
    );

    if (messages.length > 0) {
      switch (action) {
        case 'sqs':
          const sqsBatch = this.setSqsParams(messages);
          console.log(
            'Will produce a batch of sqs messages from order-steam-controller.ts',
            sqsBatch
          );
          await this.sqs.sendBatchSqsMessage(sqsBatch);
          break;
        case 'sns':
          const snsBatch = this.setSnsParams(messages);
          console.log(
            'Will publish a batch of sns messages from order-steam-controller.ts',
            snsBatch
          );
          await this.sns.publish(snsBatch);
          break;
        default:
          break;
      }
    }
  }

  private setSqsParams(
    messages: SendMessageBatchRequestEntry[]
  ): SendMessageBatchCommandInput {
    return {
      QueueUrl:
        'https://sqs.ap-southeast-2.amazonaws.com/587919987702/process-order-created',
      Entries: messages
    };
  }

  private setSnsParams(
    messages: SendMessageBatchRequestEntry[]
  ): PublishBatchCommandInput {
    return {
      TopicArn: 'arn:aws:sns:ap-southeast-2:587919987702:order-created',
      PublishBatchRequestEntries: messages.map(
        (message: SendMessageBatchRequestEntry) => {
          return {
            Id: message.Id,
            Message: message.MessageBody
          };
        }
      )
    };
  }
}
