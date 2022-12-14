import { SNSEvent } from 'aws-lambda';

export const handler = async (event: SNSEvent): Promise<void> => {
  try {
    console.log(
      'loyalty service, working as SNS subscriber for order-created topic',
      JSON.stringify(event)
    );
    // await trackEvent({
    //   source: 'loyalty-service',
    //   event: 'received-message-from-sns-topic',
    //   payload: JSON.stringify(event)
    // });
  } catch (e: any) {
    console.error('Error found in the loyalty-service handler', JSON.parse(e));
    throw new Error(e);
  }
};
