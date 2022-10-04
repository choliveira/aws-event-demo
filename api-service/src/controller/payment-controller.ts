import { PaymentModel } from '../model/payment-model';
export const paymentController = async (data: any): Promise<any> => {
  try {
    const Payment = PaymentModel();
    return await Payment.create(data);
  } catch (error: any) {
    console.log('Failed on payment-controller', JSON.stringify(error));
    return error;
  }
};
