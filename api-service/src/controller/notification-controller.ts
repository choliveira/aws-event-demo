import { IEmailData, SesService } from '../aws-services/ses-service';
import { trackEvent } from '../model/event-tracker-model';
import { convertUtcToAusTimeZone } from '../utils/date';

export const notificationController = async (order: any): Promise<void> => {
  const orderNumber = order.id.substr(order.id.length - 12);
  try {
    const emailService = new SesService();
    const emailData: IEmailData = {
      to: [order.customer.email],
      subject: `We are processing your order #${orderNumber}`,
      body: `Hello ${order.customer.email},  
        We received your order #${orderNumber} today at ${convertUtcToAusTimeZone(
        new Date(order.createdAt)
      )} and we are working on it.
        You will receive another email from us in a moment with information about your delivery.
        Thanks for shopping with us.`
    };

    console.log('notification-controller just set email data as: ', emailData);

    await emailService.sendEmail(emailData);

    await trackEvent({
      source: 'notification-service',
      event: 'send-order-confirmation-email',
      payload: JSON.stringify(emailData)
    });

    console.log(
      'notification-controller email should have been sent via ses-service without issues'
    );
  } catch (e) {
    console.log('Failed on notification-controller', JSON.stringify(e));
  }
};
