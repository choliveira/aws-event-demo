import { unmarshall } from '@aws-sdk/util-dynamodb';

export const handler = async (event: any): Promise<any> => {
  try {
    console.log('order-stream handler', JSON.stringify(event));
    const order = unmarshall(event.Records[0].dynamodb.NewImage);
    console.log('order unmarshalled', JSON.stringify(order));
  } catch (error: any) {
    console.log('Error found in the order-stream handler', JSON.parse(error));
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};
