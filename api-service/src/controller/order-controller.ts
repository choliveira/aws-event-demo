import { OrderModel } from '../model/order-model';
export const orderController = async (data: any): Promise<any> => {
  try {
    const Order = OrderModel();
    return await Order.create(data);
  } catch (error: any) {
    console.log('Failed on order-controller', JSON.stringify(error));
    return error;
  }
};
