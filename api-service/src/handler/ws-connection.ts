import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyEventV2WithRequestContext,
  APIGatewayProxyResultV2
} from 'aws-lambda';
import { wsConnectionController } from '../controller/ws-connection-controller';

export const handler = async (
  event: APIGatewayProxyEventV2WithRequestContext<APIGatewayEventWebsocketRequestContextV2>
): Promise<APIGatewayProxyResultV2> => {
  // console.log('>>>>>>>>> This is the connection-socket.ts EVENT:', event);

  const {
    requestContext: { eventType, connectionId, connectedAt }
  } = event;

  if (eventType !== 'CONNECT' && eventType !== 'DISCONNECT') {
    console.error(`The event: ${eventType} is not supported`);
    return { statusCode: 400 };
  }

  if (eventType == 'CONNECT') {
    console.log(`>>>>>>>>>> WB connected! connectionId ${connectionId}`);
  }

  if (event.requestContext.eventType == 'DISCONNECT') {
    console.log('>>>>>>>>>> WB disconnected, should update dynamo');
  }

  await wsConnectionController(eventType, connectionId, connectedAt);

  return {
    statusCode: 200
  };
};
