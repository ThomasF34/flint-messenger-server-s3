import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import { IConfig } from './config';
import { authenticationInitialize, authenticationRequired, authenticationSession, login } from './authentication';
import { getMessages, postMessage } from './messages';
import { getProfile, getUsers, patchProfile, register } from './users';
import { patchConversationSeen } from './users/patchConversationSeen';

export function createServer(config: IConfig): express.Express {
  const { session_secret } = config;

  const app = express();

  app.use(morgan('combined'));
  app.use(cors({ origin: true, credentials: true }));
  app.use(helmet());
  app.use(session({ secret: session_secret, resave: false, saveUninitialized: false }));
  app.use(authenticationInitialize());
  app.use(authenticationSession());
  app.use(express.json());

  app.post('/register', register);
  app.post('/login', login);
  app.get('/users', authenticationRequired, getUsers);
  app.get('/profile', authenticationRequired, getProfile);
  app.patch('/profile', authenticationRequired, patchProfile);
  app.patch('/profile/conversation-seen', authenticationRequired, patchConversationSeen);
  app.get('/messages', authenticationRequired, getMessages);
  app.post('/messages', authenticationRequired, postMessage);

  return app;
}
