import { SQSRecord } from 'aws-lambda';
import { IEmailData, SesService } from '../aws-services/ses-service';
import { retrieveAusPostTracker } from '../utils/ausPostTracker';

const sender = 'contact@carlosholiveira.com';

export const deliveryController = async (records: SQSRecord[]) => {
  try {
    const emailService = new SesService(sender);

    return records.forEach(async (r: SQSRecord) => {
      const order = JSON.parse(r.body);

      const tracker: string = retrieveAusPostTracker();

      const emailData: IEmailData = {
        to: [order.customer.email],
        subject: `We are working on your delivery for order: ${order.id}`,
        body: `We received the request for ${order.delivery.type} delivery to your address at: ${order.delivery.address} for your order: ${order.id}. Please use this number ${tracker} to track your order on AusPost`
      };

      await emailService.sendEmail(emailData);
    });
  } catch (e) {
    console.log('Failed on delivery-controller', JSON.stringify(e));
    return e;
  }
};
