import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { orderController } from '../controller/order-controller';
import { trackEvent } from '../model/event-tracker-model';

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    await trackEvent({
      source: 'post-order-endpoint',
      event: 'received-request-from-api-gateway',
      payload: JSON.stringify(event.body!)
    });

    const body = JSON.parse(event.body!);
    const order = await orderController(body);

    await trackEvent({
      source: 'post-order-endpoint',
      event: 'order-created-dynamodb',
      payload: JSON.stringify(order)
    });

    return {
      statusCode: 200,
      body: JSON.stringify(order)
    };
  } catch (error: any) {
    console.log('Error found in the post-order handler', JSON.parse(error));
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};
