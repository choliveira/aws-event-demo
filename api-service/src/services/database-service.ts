import * as dynamoose from 'dynamoose';

const options = {
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: 'ap-southeast-2'
};

export const databaseService = (table: any, models: any[]) => {
  if (process.env.IS_OFFLINE) {
    dynamoose.aws.ddb.local();
    return;
  }

  new dynamoose.Table(table, models, { create: false, waitForActive: false });
  const ddb = new dynamoose.aws.ddb.DynamoDB(options);
  dynamoose.aws.ddb.set(ddb);
  console.log('Dynamoose set.....');
};
