import { SendMessageCommandOutput } from '@aws-sdk/client-sqs';
import { SqsParameters, SqsService } from '../aws-services/sqs-service';

export class OrderStreamController {
  constructor() {}

  /**
   * sqsProducer
   */
  public async sqsProducer(order: any): Promise<SendMessageCommandOutput> {
    console.log(
      'Im the sqsProducer and I will send this data as a message payload to SQS.',
      order
    );
    const params: SqsParameters = {
      payload: JSON.stringify({ order: order.id }),
      source: 'order-stream-service',
      title: 'Order created',
      queueUrl:
        'https://sqs.ap-southeast-2.amazonaws.com/587919987702/process-order-created'
    };
    try {
      const sqs = new SqsService();
      return await sqs.sendSqsMessage(params);
    } catch (err: any) {
      console.error('Error happened on order-stream-controller', err);
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
}
