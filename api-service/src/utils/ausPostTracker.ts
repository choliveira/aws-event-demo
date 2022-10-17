import { v4 as uuidv4 } from 'uuid';

export const retrieveAusPostTracker = (): string => {
  let tracker: string = uuidv4();
  return tracker.substr(tracker.length - 12);
};
