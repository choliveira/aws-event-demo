import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';
import { databaseService } from '../services/database-service';

const TABLE = process.env.IS_OFFLINE
  ? `aws-event-demo-api-service-local-payment`
  : process.env.PAYMENT_TABLE!;

const PaymentSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4()
    },
    status: String,
    amountPaid: Number,
    price: Number,
    discount: {
      type: Number,
      default: 0
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    productId: String,
    productTitle: String,
    costumer: String
  },
  {
    timestamps: {
      createdAt: ['createdAt'],
      updatedAt: ['updatedAt']
    }
  }
);

export const PaymentModel = () => {
  databaseService();
  const Model = dynamoose.model(TABLE, PaymentSchema);
  new dynamoose.Table(TABLE, [Model], { create: false, waitForActive: false });
  return Model;
};
