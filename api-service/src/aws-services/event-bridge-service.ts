import {
  EventBridgeClient,
  PutEventsCommand,
  PutEventsCommandInput
} from '@aws-sdk/client-eventbridge';

export class EventBridgeService {
  private client: EventBridgeClient;
  constructor() {
    this.client = new EventBridgeClient({
      credentials: {
        accessKeyId: process.env.ACCESS_KEY!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!
      },
      region: 'ap-southeast-2'
    });
  }

  /**
   * publish
   */
  public async publish(params: PutEventsCommandInput) {
    try {
      const data = await this.client.send(new PutEventsCommand(params));
      console.log(
        'EventBridge service just published successfully to event bus',
        data
      );
    } catch (e) {
      console.error(
        'Fail to publish to an event bus from event-bridge-service.ts',
        params,
        e
      );
    }
  }
}
