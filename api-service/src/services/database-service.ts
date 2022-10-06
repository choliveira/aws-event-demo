import * as dynamoose from 'dynamoose';

const options = {
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: 'ap-southeast-2'
};

export const databaseService = () => {
  if (process.env.IS_OFFLINE) {
    dynamoose.aws.ddb.local();
    return;
  }
  console.log('Data base service options', options);
  const ddb = new dynamoose.aws.ddb.DynamoDB(options);
  console.log('Data base service instantiated', ddb);
  dynamoose.aws.ddb.set(ddb);
};
