import { SQSClient } from '@aws-sdk/client-sqs';
const REGION = 'ap-southeast-2';
const sqsClient = new SQSClient({ region: REGION });
export { sqsClient };
