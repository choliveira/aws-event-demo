import * as dynamoose from 'dynamoose';

const options = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ap-southeast-2'
};

export const databaseService = () => {
  if (process.env.IS_OFFLINE) {
    dynamoose.aws.ddb.local();
    return;
  }

  const ddb = new dynamoose.aws.ddb.DynamoDB(options);
  dynamoose.aws.ddb.set(ddb);
};
