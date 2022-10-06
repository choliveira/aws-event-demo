import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { orderController } from '../controller/order-controller';

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const body = JSON.parse(event.body!);
    const order = await orderController(body);
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
