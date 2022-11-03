import { DynamoDBStreamEvent } from 'aws-lambda';
import { OrderStreamController } from '../controller/order-stream-controller';
import { trackEvent } from '../model/event-tracker-model';

export const handler = async (event: DynamoDBStreamEvent): Promise<any> => {
  try {
    console.log('Starting order-stream handler');
    /** Use this when run locally */
    //@ts-ignore
    // const body = JSON.parse(event.body!);
    // const records = body.Records;

    const records = event.Records;
    const orderStreamController = new OrderStreamController();

    await trackEvent({
      source: 'order-stream-service',
      event: 'received-stream-from-order-table',
      payload: JSON.stringify(records)
    });

    //1 - Produce a message to an SQS Queue
    await orderStreamController.sqsProducer(records);

    // 2 - Publish a message to an SNS Topic
    await orderStreamController.snsPublisher(records);

    // 3 - Send a message to an Event Bus (EventBridge)
    await orderStreamController.eventBusPublisher(records);

    console.log('Response from sending message to sqs in th handler');
  } catch (error: any) {
    console.log('Error found in the order-stream handler', JSON.parse(error));
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};
