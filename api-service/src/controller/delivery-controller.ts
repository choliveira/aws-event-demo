import { SQSRecord } from 'aws-lambda';
import { IEmailData, SesService } from '../aws-services/ses-service';
import { retrieveAusPostTracker } from '../utils/ausPostTracker';

export const deliveryController = async (
  records: SQSRecord[]
): Promise<void> => {
  try {
    const emailService = new SesService();
    console.log('delivery controller', records);
    const orders: any[] = records.map((r: SQSRecord) => {
      return JSON.parse(r.body);
    });

    if (orders.length <= 0) {
      return;
    }

    /**
     * TODO: This is a hack for the demo to just get the first order coming from the event and send one email,
     * otherwise we need to refactor ses-service to send bulk email
     **/
    const order = orders[0];

    console.log(
      'delivery-controller extracted order from event records',
      order
    );
    const tracker: string = retrieveAusPostTracker();
    const orderNumber = order.id.substr(order.id.length - 12);
    const emailData: IEmailData = {
      to: [order.customer.email],
      subject: `We are working on your delivery for order: ${orderNumber}`,
      body: `We received the request for ${order.delivery.type} delivery to your address at: ${order.delivery.address} for your order: ${orderNumber}. Please use this number ${tracker} to track your order on AusPost`
    };

    console.log('delivery-controller just set email data as: ', emailData);

    return await new Promise((resolve) => {
      setTimeout(async () => {
        await emailService.sendEmail(emailData);
        console.log(
          'delivery-controller email should have been sent via ses-service without issues'
        );
        resolve();
      }, 20000);
    });
  } catch (e) {
    console.log('Failed on delivery-controller', JSON.stringify(e));
  }
};
