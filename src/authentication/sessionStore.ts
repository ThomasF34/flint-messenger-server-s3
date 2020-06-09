import session, { Store } from 'express-session';
import connectMongo from 'connect-mongo';
import { IConfig } from '../config';

const MongoStore = connectMongo(session);

export function sessionStoreFactory(config: IConfig): Store {
  const { mongo_user, mongo_pass, mongo_host, mongo_database } = config;
  const mongoIdentity = `${mongo_user}:${mongo_pass}`;
  const mongoServer = `${mongo_host}`;
  const mongoUri = `mongodb+srv://${mongoIdentity}@${mongoServer}/${mongo_database}`;
  return new MongoStore({ url: mongoUri });
}
