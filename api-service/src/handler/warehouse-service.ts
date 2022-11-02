import { EventBridgeHandler } from 'aws-lambda';

export const handler: EventBridgeHandler<
  string,
  { message: string },
  boolean
> = async (event) => {
  console.log(`warehouse-service received event: ${JSON.stringify(event)}`);

  return true;
};
