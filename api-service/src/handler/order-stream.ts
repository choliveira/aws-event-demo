export const handler = async (event: any): Promise<any> => {
  try {
    console.log('order-stream handler', event);
  } catch (error: any) {
    console.log('Error found in the order-stream handler', JSON.parse(error));
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};