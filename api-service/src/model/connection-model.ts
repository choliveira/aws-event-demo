import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';
import { databaseService } from '../services/database-service';

const TABLE = process.env.IS_OFFLINE
  ? `aws-event-demo-api-service-local-connection`
  : process.env.CONNECTION_TABLE!;

const ConnectionSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4()
    },
    connectedAt: Number
  },
  {
    timestamps: {
      createdAt: ['createdAt'],
      updatedAt: ['updatedAt']
    }
  }
);

export const ConnectionModel = () => {
  const Model = dynamoose.model(TABLE, ConnectionSchema);
  databaseService(TABLE, [Model]);
  return Model;
};
