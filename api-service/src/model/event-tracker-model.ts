import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';
import { databaseService } from '../services/database-service';

const TABLE = process.env.IS_OFFLINE
  ? `aws-event-demo-api-service-local-event-tracker`
  : process.env.EVENT_TRACKER_TABLE!;

const EventTrackerSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4()
    },
    source: String,
    event: String,
    payload: String
  },
  {
    timestamps: {
      createdAt: ['createdAt'],
      updatedAt: ['updatedAt']
    }
  }
);

const EventTrackerModel = () => {
  const Model = dynamoose.model(TABLE, EventTrackerSchema);
  databaseService(TABLE, [Model]);
  return Model;
};

interface IEventToTrack {
  source: string;
  event: string;
  payload: string;
}

export const trackEvent = async (data: IEventToTrack): Promise<void> => {
  console.log('will add event to db', data);
  try {
    const Event = EventTrackerModel();
    await Event.create(data);
    console.log('Event tracker added', data);
  } catch (e) {
    console.error(
      'Failed at addEventToDB on event-tracker-model.ts',
      JSON.stringify(e)
    );
  }
};
