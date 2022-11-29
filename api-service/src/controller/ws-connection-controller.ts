import { ConnectionModel } from '../model/connection-model';
export const wsConnectionController = async (
  type: string,
  connectionId: string,
  connectedAt: number
) => {
  switch (type) {
    case 'CONNECT':
      await wsConnect(connectionId, connectedAt);
      break;

    default:
      await wsDisconnect(connectionId);
      break;
  }
};

const wsConnect = async (connectionId: string, connectedAt: number) => {
  try {
    const model = ConnectionModel();
    return await model.create({ id: connectionId, connectedAt });
  } catch (error: any) {
    console.log('Failed on ws-connection-controller', JSON.stringify(error));
    return error;
  }
};

const wsDisconnect = async (connectionId: string) => {
  try {
    const model = ConnectionModel();
    await model.delete({ id: connectionId });
  } catch (error) {
    console.log('Failed on ws-connection-controller', JSON.stringify(error));
    return error;
  }
};
