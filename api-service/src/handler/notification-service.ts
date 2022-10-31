import { EventBridgeHandler } from 'aws-lambda';

export const handler: EventBridgeHandler<
  string,
  { message: string },
  boolean
> = async (event) => {
  console.log(`Received event: ${JSON.stringify(event)}`);
  console.log(`Event message: ${event.detail.message}`); // strongly typed access to event message

  return true;
};
