import { OrderModel } from '../model/order-model';
export const orderController = async (data: any): Promise<any> => {
  const Order = OrderModel();
  const newOrder = new Order(data);
  try {
    return await newOrder.save();
  } catch (error: any) {
    console.log('Failed on order-controller', JSON.stringify(error));
    return error;
  }
};
