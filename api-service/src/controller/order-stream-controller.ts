import { SendMessageBatchRequestEntry } from '@aws-sdk/client-sqs';
import { DynamoDBRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { SqsService } from '../aws-services/sqs-service';

export class OrderStreamController {
  private sqs: SqsService;
  constructor() {
    this.sqs = new SqsService();
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
        const batch = {
          QueueUrl:
            'https://sqs.ap-southeast-2.amazonaws.com/587919987702/process-order-created',
          Entries: messages
        };
        await this.sqs.sendBatchSqsMessage(batch);
      }
    } catch (err: any) {
      console.error(
        'Error happened on order-stream-controller',
        JSON.stringify(err)
      );
    }
  }

  public snsPublisher(data: any) {
    console.log(
      'Im the snsPublisher and I will send this data as a message payload to an SNS Topic.',
      data
    );
  }

  public eventBusPublisher(data: any) {
    console.log(
      'Im the eventBusPublisher and I will send this data as a message payload to an SNS Topic.',
      data
    );
  }
}
