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
    products: {
      type: Array,
      schema: [
        {
          type: Object,
          schema: {
            id: String,
            quantity: Number
          }
        }
      ]
    },
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
  console.log('Will save in the order table. tablename:', TABLE);
  const Model = dynamoose.model(TABLE, OrderSchema);
  databaseService(TABLE, [Model]);
  return Model;
};
