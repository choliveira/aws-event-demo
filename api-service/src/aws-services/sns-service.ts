import {
  PublishBatchCommand,
  PublishBatchCommandInput,
  SNSClient
} from '@aws-sdk/client-sns';
export class SnsService {
  private snsClient: SNSClient;

  constructor() {
    this.snsClient = new SNSClient({
      credentials: {
        accessKeyId: process.env.ACCESS_KEY!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!
      },
      region: 'ap-southeast-2'
    });
  }

  /**
   * Publish a message to an SNS topic
   * @param params PublishBatchCommandInput
   */
  public async publish(params: PublishBatchCommandInput): Promise<void> {
    try {
      console.log('Will publish to a sns topic from SnsService class', params);
      await this.snsClient.send(new PublishBatchCommand(params));
      console.log(
        'Batch messages published successful to an sns topic from SnsService class'
      ),
        params;
    } catch (e) {
      console.error(
        'Fail to publish to a sns topic from sns-service.ts',
        params,
        e
      );
    }
  }
}
