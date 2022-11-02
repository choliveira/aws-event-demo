import { EventBridgeEvent } from 'aws-lambda';
import { notificationController } from '../controller/notification-controller';

// export const handler: EventBridgeHandler<
//   string,
//   { message: string },
//   boolean
// > = async (event) => {
//   console.log(`Received event: ${JSON.stringify(event)}`);
//   console.log(`Event message: ${event.detail.message}`); // strongly typed access to event message

//   return true;
// };

export const handler = async (
  event: EventBridgeEvent<string, string>
): Promise<void> => {
  console.log(`Received event: ${JSON.stringify(event)}`);
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
