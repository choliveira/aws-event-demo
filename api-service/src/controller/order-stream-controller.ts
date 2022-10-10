import { DynamoDBRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { SqsParameters, SqsService } from '../aws-services/sqs-service';

export class OrderStreamController {
  constructor() {}

  /**
   * sqsProducer
   */
  public async sqsProducer(records: DynamoDBRecord[]): Promise<void> {
    console.log(
      'Im the sqsProducer and I will send this data as a message payload to SQS.',
      JSON.stringify(records)
    );

    try {
      const orders = records.map((r: DynamoDBRecord): any => {
        if (r.eventName === 'INSERT' && r.dynamodb && r.dynamodb.NewImage) {
          return DynamoDB.Converter.unmarshall(r.dynamodb.NewImage);
        }
      });

      const sqs = new SqsService();
      if (orders.length > 0) {
        orders.forEach((order) => {
          const data: SqsParameters = this.setSqsMessageParameters(order);
          sqs.sendSqsMessage(data);
        });
      }
    } catch (err: any) {
      console.error(
        'Error happened on order-stream-controller',
        JSON.stringify(err)
      );
      throw new Error(err);
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

  private setSqsMessageParameters(data: any): SqsParameters {
    return {
      payload: JSON.stringify(data),
      source: 'order-stream-service',
      title: 'Order created',
      queueUrl:
        'https://sqs.ap-southeast-2.amazonaws.com/587919987702/process-order-created'
    };
  }
}
