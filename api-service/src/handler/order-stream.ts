// import { DynamoDBStreamEvent } from 'aws-lambda';
import { OrderStreamController } from '../controller/order-stream-controller';

export const handler = async (event: any): Promise<any> => {
  try {
    console.log('Starting order-stream handler');
    //TODO: fix this before commit
    // const body = JSON.parse(event.body!);
    // const records = body.Records;
    const records = event.Records;
    const orderStreamController = new OrderStreamController();
    await orderStreamController.sqsProducer(records);
    // 2 - Publish a message to an SNS Topic
    // orderStreamController.snsPublisher(order);

    // 3 - Send a message to an Event Bus (EventBridge)
    // orderStreamController.eventBusPublisher(order);

    console.log('Response from sending message to sqs in th handler');
  } catch (error: any) {
    console.log('Error found in the order-stream handler', JSON.parse(error));
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};
