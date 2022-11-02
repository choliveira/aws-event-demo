import { IEmailData, SesService } from '../aws-services/ses-service';
import { convertUtcToAusTimeZone } from '../utils/date';

export const notificationController = async (order: any): Promise<void> => {
  try {
    const emailService = new SesService();
    const emailData: IEmailData = {
      to: [order.customer.email],
      subject: `We are processing your order #${order.id}`,
      body: `Hello ${order.customer.email},  
        We received your order #${
          order.delivery.type
        } today at ${convertUtcToAusTimeZone(
        new Date(order.createdAt)
      )} and we are working on it.
        You will receive another email from us in a moment with information about your delivery.
        Thanks for shopping with us.`
    };

    console.log('notification-controller just set email data as: ', emailData);

    await emailService.sendEmail(emailData);

    console.log(
      'notification-controller email should have been sent via ses-service without issues'
    );
  } catch (e) {
    console.log('Failed on notification-controller', JSON.stringify(e));
  }
};
