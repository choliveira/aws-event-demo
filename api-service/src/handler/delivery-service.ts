import { SQSEvent } from 'aws-lambda';
import { deliveryController } from '../controller/delivery-controller';

export const handler = async (event: SQSEvent): Promise<void> => {
  try {
    const orders = event.Records;
    console.log(
      'delivery-service handler received message from sqs',
      JSON.stringify(orders)
    );
    await deliveryController(orders);
    console.log('Email dispatched, just check recipient inbox');
  } catch (e: any) {
    console.error('Error found in the delivery-service handler', JSON.parse(e));
    throw new Error(e);
  }
};
