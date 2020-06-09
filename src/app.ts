import { createServer, Server } from 'http';
import { configuration } from './config';
import { connect } from './database';
import { createExpressApp } from './server';
import { sessionStoreFactory } from './authentication';
import { initializeSockets } from './socket';

export async function start(): Promise<Server> {
  const config = configuration();
  const { PORT } = config;
  await connect(config);
  const sessionStore = sessionStoreFactory(config);
  const app = createExpressApp(config, sessionStore);
  const server = createServer(app);
  initializeSockets(config, server, sessionStore);
  server.listen(PORT, () => console.log(`Flint messenger listening at ${PORT}`));
  return server;
}
