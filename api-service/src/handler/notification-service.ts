import { EventBridgeEvent } from 'aws-lambda';
import { notificationController } from '../controller/notification-controller';

export const handler = async (
  event: EventBridgeEvent<string, string>
): Promise<boolean> => {
  const order = event.detail;
  console.log(
    'notification-service handler received order message from event bus',
    order
  );
  // await trackEvent({
  //   source: 'notification-service',
  //   event: 'received-message-from-event-bus',
  //   payload: JSON.stringify(event)
  // });
  await notificationController(order);
  console.log(
    'Email dispatched from notification-service, just check recipient inbox'
  );
  return true;
};
