import { EventBridgeEvent } from 'aws-lambda';
import { notificationController } from '../controller/notification-controller';

export const handler = async (
  event: EventBridgeEvent<string, string>
): Promise<void> => {
  console.log(`Received event: ${JSON.stringify(event)}`);
  /** Use this when run locally */
  //@ts-ignore
  // const body = JSON.parse(event.body!);
  // const order = body.detail;

  const order = event.detail;
  console.log(
    'notification-service handler received order message from event bus',
    order
  );
  await notificationController(order);
  console.log(
    'Email dispatched from notification-service, just check recipient inbox'
  );
};
