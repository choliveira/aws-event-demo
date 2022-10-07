import { unmarshall } from '@aws-sdk/util-dynamodb';

export const handler = async (event: any): Promise<any> => {
  try {
    console.log('order-stream handler', JSON.stringify(event));

    const records = event.Records;
    records.forEach((stream: any) => {
      if (stream.dynamodb.eventName !== 'INSERT') {
        return;
      }

      const order = unmarshall(stream.dynamodb.NewImage);
      console.log('order unmarshalled', JSON.stringify(order));
      /** TODO:
       * 1 - Produce a message to SQS
       * 2 - Publish a message to an SNS Topic
       * 3 - Send a message to an Event Bus (EventBridge)
       * */

      //1 - Produce a message to SQS
      sqsProducer(order);

      // 2 - Publish a message to an SNS Topic
      snsPublisher(order);

      // 3 - Send a message to an Event Bus (EventBridge)
      eventBusPublisher(order);
    });
  } catch (error: any) {
    console.log('Error found in the order-stream handler', JSON.parse(error));
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};

const sqsProducer = (data: any) => {
  console.log(
    'Im the sqsProducer and I will send this data as a message payload to SQS.',
    data
  );
};

const snsPublisher = (data: any) => {
  console.log(
    'Im the snsPublisher and I will send this data as a message payload to an SNS Topic.',
    data
  );
};

const eventBusPublisher = (data: any) => {
  console.log(
    'Im the eventBusPublisher and I will send this data as a message payload to an SNS Topic.',
    data
  );
};
