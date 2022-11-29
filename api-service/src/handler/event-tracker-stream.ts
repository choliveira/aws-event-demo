import { DynamoDBStreamEvent } from 'aws-lambda';

export const handler = async (event: DynamoDBStreamEvent): Promise<any> => {
  try {
    console.log('Starting event-tracker-stream handler', JSON.stringify(event));
    /** Use this when run locally */
    //@ts-ignore
    // const body = JSON.parse(event.body!);
    // const records = body.Records;
  } catch (error: any) {
    console.log(
      'Error found in the event-tracker-stream handler',
      JSON.parse(error)
    );
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};
