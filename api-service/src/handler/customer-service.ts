import { SNSEvent } from 'aws-lambda';

export const handler = async (event: SNSEvent): Promise<void> => {
  try {
    console.log(
      'customer service, working as SNS subscriber for order-created topic',
      JSON.stringify(event)
    );
  } catch (e: any) {
    console.error('Error found in the customer-service handler', JSON.parse(e));
    throw new Error(e);
  }
};