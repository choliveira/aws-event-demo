import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { DynamoDBStreamEvent } from 'aws-lambda';
import { sqsClient } from '../utils/sqs';

export const handler = async (event: DynamoDBStreamEvent): Promise<any> => {
  try {
    // const orderStreamController = new OrderStreamController();
    console.log('order-stream handler', JSON.stringify(event));
    // await run();
    // console.log('Response from sending message to sqs in th handler');
    const records = event.Records;
    records.forEach(async (stream: any) => {
      if (stream.eventName !== 'INSERT') {
        return;
      }

      // const order = DynamoDB.Converter.unmarshall(stream.dynamodb.NewImage);
      const order = stream.dynamodb.Keys;
      console.log('order unmarshalled', JSON.stringify(order));

      //1 - Produce a message to SQS
      // const controller = await orderStreamController.sqsProducer(order);
      // console.log(
      //   'Response from sending message to sqs in th handler',
      //   controller
      // );
      await run(JSON.stringify(order));
      console.log('Response from sending message to sqs in th handler');

      // 2 - Publish a message to an SNS Topic
      // orderStreamController.snsPublisher(order);

      // 3 - Send a message to an Event Bus (EventBridge)
      // orderStreamController.eventBusPublisher(order);
    });
  } catch (error: any) {
    console.log('Error found in the order-stream handler', JSON.parse(error));
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};

const run = async (data: string) => {
  const params = {
    DelaySeconds: 10,
    MessageAttributes: {
      Title: {
        DataType: 'String',
        StringValue: 'The Whistler'
      },
      Author: {
        DataType: 'String',
        StringValue: 'John Grisham'
      },
      WeeksOn: {
        DataType: 'Number',
        StringValue: '6'
      }
    },
    MessageBody: data,
    // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
    // MessageGroupId: "Group1",  // Required for FIFO queues
    QueueUrl:
      'https://sqs.ap-southeast-2.amazonaws.com/587919987702/process-order-created' //SQS_QUEUE_URL; e.g., 'https://sqs.REGION.amazonaws.com/ACCOUNT-ID/QUEUE-NAME'
  };
  try {
    console.log('Will send message to SQS...', params);
    const data = await sqsClient.send(new SendMessageCommand(params));
    console.log('Success, message sent. MessageID:', data.MessageId);
    return data; // For unit tests.
  } catch (err) {
    console.log('Error', err);
  }
};
