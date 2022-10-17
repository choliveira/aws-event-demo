import { SQSRecord } from 'aws-lambda';
import { IEmailData, SesService } from '../aws-services/ses-service';
import { retrieveAusPostTracker } from '../utils/ausPostTracker';

const sender = 'contact@carlosholiveira.com';

export const deliveryController = async (
  records: SQSRecord[]
): Promise<void> => {
  try {
    const emailService = new SesService(sender);

    return records.forEach(async (r: SQSRecord) => {
      const order = JSON.parse(r.body);
      console.log(
        'delivery-controller extracted order from event records',
        order
      );

      const tracker: string = retrieveAusPostTracker();

      const emailData: IEmailData = {
        to: [order.customer.email],
        subject: `We are working on your delivery for order: ${order.id}`,
        body: `We received the request for ${order.delivery.type} delivery to your address at: ${order.delivery.address} for your order: ${order.id}. Please use this number ${tracker} to track your order on AusPost`
      };

      console.log('delivery-controller just set email data as: ', emailData);

      await emailService.sendEmail(emailData);

      console.log(
        'delivery-controller email should have been sent via ses-service without issues'
      );
    });
  } catch (e) {
    console.log('Failed on delivery-controller', JSON.stringify(e));
  }
};
