import { unmarshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBStreamEvent } from 'aws-lambda';
import { OrderStreamController } from '../controller/order-stream-controller';

export const handler = async (event: DynamoDBStreamEvent): Promise<any> => {
  try {
    const orderStreamController = new OrderStreamController();
    console.log('order-stream handler', JSON.stringify(event));

    const records = event.Records;
    records.forEach((stream: any) => {
      if (stream.eventName !== 'INSERT') {
        return;
      }

      const order = unmarshall(stream.dynamodb.NewImage);
      console.log('order unmarshalled', JSON.stringify(order));

      //1 - Produce a message to SQS
      orderStreamController.sqsProducer(order);

      // 2 - Publish a message to an SNS Topic
      orderStreamController.snsPublisher(order);

      // 3 - Send a message to an Event Bus (EventBridge)
      orderStreamController.eventBusPublisher(order);
    });
  } catch (error: any) {
    console.log('Error found in the order-stream handler', JSON.parse(error));
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};
