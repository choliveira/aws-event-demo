import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { paymentController } from '../controller/payment-controller';

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const body = JSON.parse(event.body!);
    const payment = await paymentController(body);
    return {
      statusCode: 200,
      body: JSON.stringify(payment)
    };
  } catch (error: any) {
    console.log('Error found in the post-page handler', JSON.parse(error));
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};
