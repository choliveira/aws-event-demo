import { EventBridgeEvent } from 'aws-lambda';
import { notificationController } from '../controller/notification-controller';
import { trackEvent } from '../model/event-tracker-model';

export const handler = async (
  event: EventBridgeEvent<string, string>
): Promise<boolean> => {
  /** Use this when run locally */
  //@ts-ignore
  // const body = JSON.parse(event.body!);
  // const order = body.detail;

  const order = event.detail;
  console.log(
    'notification-service handler received order message from event bus',
    order
  );
  await trackEvent({
    source: 'notification-service',
    event: 'received-message-from-event-bus',
    payload: JSON.stringify(event)
  });
  await notificationController(order);
  console.log(
    'Email dispatched from notification-service, just check recipient inbox'
  );
  return true;
};
