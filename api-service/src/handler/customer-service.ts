import { SNSEvent } from 'aws-lambda';
import { trackEvent } from '../model/event-tracker-model';

export const handler = async (event: SNSEvent): Promise<void> => {
  try {
    console.log(
      'customer service, working as SNS subscriber for order-created topic',
      JSON.stringify(event)
    );
    await trackEvent({
      source: 'customer-service',
      event: 'received-message-from-sns-topic',
      payload: JSON.stringify(event)
    });
  } catch (e: any) {
    console.error('Error found in the customer-service handler', JSON.parse(e));
    throw new Error(e);
  }
};
