import { DynamoDBRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { ApiGatewayManagementApiService } from '../aws-services/api-gateway-mgmt-api-service';
import { ConnectionModel } from '../model/connection-model';

export const eventTrackerController = async (records: DynamoDBRecord[]) => {
  try {
    const Connection = ConnectionModel();
    const liveConnection: any = await Connection.scan().limit(1).exec();
    if (
      !liveConnection ||
      !liveConnection.count ||
      liveConnection.count === 0 ||
      !liveConnection.lastKey
    ) {
      console.log('ConnectionId not found in the connection table');
      return;
    }
    const apiServices = new ApiGatewayManagementApiService(
      liveConnection.lastKey.id
    );

    for await (const record of records) {
      const event = DynamoDB.Converter.unmarshall(record.dynamodb?.NewImage!);
      console.log(
        '------------------- will send message to ws -------------------'
      );
      await apiServices.sendMessageToConnection(event);
      console.log('----------Message sent---------', event);
    }
  } catch (error) {
    console.error(
      'Error on event-tracker-steam-controller.ts',
      JSON.stringify(error)
    );
    throw new Error('Error on event-tracker-steam-controller.ts');
  }
};
