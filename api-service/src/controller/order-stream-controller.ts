import { PutEventsCommandInput } from '@aws-sdk/client-eventbridge';
import { PublishBatchCommandInput } from '@aws-sdk/client-sns';
import {
  SendMessageBatchCommandInput,
  SendMessageBatchRequestEntry
} from '@aws-sdk/client-sqs';
import { DynamoDBRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { EventBridgeService } from '../aws-services/event-bridge-service';
import { SnsService } from '../aws-services/sns-service';
import { SqsService } from '../aws-services/sqs-service';

export class OrderStreamController {
  private sqs: SqsService;
  private sns: SnsService;
  private eb: EventBridgeService;
  constructor() {
    this.sqs = new SqsService();
    this.sns = new SnsService();
    this.eb = new EventBridgeService();
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

  public async eventBusPublisher(records: DynamoDBRecord[]) {
    console.log(
      'Im the eventBusPublisher and I will send this data as a message payload to an Event bus.',
      records
    );

    const params: PutEventsCommandInput = {
      Entries: records.map((r: DynamoDBRecord): any => {
        if (r.eventName === 'INSERT' && r.dynamodb && r.dynamodb.NewImage) {
          const order = DynamoDB.Converter.unmarshall(r.dynamodb.NewImage);
          return {
            EventBusName: 'order-created-bus',
            Detail: JSON.stringify(order),
            DetailType: 'transaction',
            Resources: [],
            Source: 'orderCreated'
          };
        }
      })
    };
    if (params.Entries?.length === 0) {
      console.warn(
        'No order to be sent at eventBusPublisher',
        JSON.stringify(params)
      );
      return;
    }
    try {
      await this.eb.publish(params);
      // await trackEvent({
      //   source: 'order-stream-service',
      //   event: 'send-order-message-to-event-bus',
      //   payload: JSON.stringify(params)
      // });
      console.log(
        'order-stream-controller published to event bridge successfully',
        params
      );
    } catch (e) {
      console.error(
        'Error happened on order-stream-controller at eventBusPublisher',
        JSON.stringify(e)
      );
    }
  }

  /**
   * @todo refactor this method in here to be more similar to the eventBusPublisher
   * @param records DynamoDBRecord[]
   * @param action string
   */
  private async setBatch(records: DynamoDBRecord[], action: string) {
    const messages: any[] = records.map((r: DynamoDBRecord): any => {
      if (r.eventName === 'INSERT' && r.dynamodb && r.dynamodb.NewImage) {
        return DynamoDB.Converter.unmarshall(r.dynamodb.NewImage);
      }
    });

    if (messages.length > 0) {
      switch (action) {
        case 'sqs':
          const sqsBatch = this.setSqsParams(messages);
          console.log(
            'Will produce a batch of sqs messages from order-steam-controller.ts',
            sqsBatch
          );
          await this.sqs.sendBatchSqsMessage(sqsBatch);
          // await trackEvent({
          //   source: 'order-stream-service',
          //   event: 'send-order-message-to-sqs',
          //   payload: JSON.stringify(sqsBatch)
          // });
          break;
        case 'sns':
          const snsBatch = this.setSnsParams(messages);
          // await trackEvent({
          //   source: 'order-stream-service',
          //   event: 'send-order-message-to-sns',
          //   payload: JSON.stringify(messages)
          // });
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

  private setSqsParams(messages: any[]): SendMessageBatchCommandInput {
    const entries: SendMessageBatchRequestEntry[] = messages.map((order) => {
      return this.sqs.setBatchMessagesAtt({
        payload: JSON.stringify(order),
        source: 'order-stream-service',
        title: 'Order created'
      });
    });
    return {
      QueueUrl:
        'https://sqs.ap-southeast-2.amazonaws.com/587919987702/process-order-created',
      Entries: entries
    };
  }

  private setSnsParams(messages: any[]): PublishBatchCommandInput {
    return {
      TopicArn: 'arn:aws:sns:ap-southeast-2:587919987702:order-created',
      PublishBatchRequestEntries: messages.map((order) => {
        return {
          Id: uuidv4(),
          Message: JSON.stringify(order)
        };
      })
    };
  }
}
