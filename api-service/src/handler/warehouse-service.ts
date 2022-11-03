import { EventBridgeHandler } from 'aws-lambda';
import { trackEvent } from '../model/event-tracker-model';

export const handler: EventBridgeHandler<
  string,
  { message: string },
  boolean
> = async (event) => {
  console.log(`warehouse-service received event: ${JSON.stringify(event)}`);
  await trackEvent({
    source: 'warehouse-service',
    event: 'received-message-from-event-bus',
    payload: JSON.stringify(event)
  });
  return true;
};
