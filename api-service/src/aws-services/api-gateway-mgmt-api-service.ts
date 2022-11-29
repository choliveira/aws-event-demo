import { ApiGatewayManagementApi } from '@aws-sdk/client-apigatewaymanagementapi';

export class ApiGatewayManagementApiService {
  private apiGateway: ApiGatewayManagementApi;
  private connectionId: string;

  constructor(connectionId: string) {
    this.apiGateway = new ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: process.env.IS_OFFLINE
        ? `http://${process.env.WEBSOCKETS_API_ENDPOINT}`
        : `https://${process.env.WEBSOCKETS_API_ENDPOINT}`
    });
    this.connectionId = connectionId;
  }

  public async sendMessageToConnection(message: any): Promise<void> {
    try {
      await this.apiGateway.postToConnection({
        ConnectionId: this.connectionId,
        Data: JSON.stringify(message) as any
      });
    } catch (err: any) {
      if (err.$metadata.httpStatusCode === 410) {
        console.log(
          `Attempted to send message to a websocket connection that is already gone, removing connectionId ${this.connectionId} from pairing`
        );
      } else {
        console.error('Error with sending message to websocket', { err });
      }
      throw new Error('Error with sending message to websocket');
    }
  }

  public async deleteConnection(): Promise<void> {
    try {
      await this.apiGateway.deleteConnection({
        ConnectionId: this.connectionId
      });
    } catch (err: any) {
      // Issue with disconnecting websocket connection. Will eventually be disconnected by AWS for inactivity
      console.warn(
        `Issue with deleting websocket connection with id ${this.connectionId}`,
        { err }
      );
    }
  }
}
