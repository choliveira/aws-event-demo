import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';
import { databaseService } from '../services/database-service';

const TABLE = process.env.IS_OFFLINE
  ? `aws-event-demo-api-service-local-order`
  : process.env.ORDER_TABLE!;

const OrderSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4()
    },
    productId: String,
    customer: {
      type: Object,
      schema: {
        email: String,
        phone: String
      }
    },
    delivery: {
      type: Object,
      schema: {
        type: String,
        address: String
      }
    },
    amountPaid: Number,
    paymentId: String
  },
  {
    timestamps: {
      createdAt: ['createdAt'],
      updatedAt: ['updatedAt']
    }
  }
);

export const OrderModel = () => {
  databaseService();
  return dynamoose.model(TABLE, OrderSchema);
};
