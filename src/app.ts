import { createServer, Server } from 'http';
import { configuration } from './config';
import { connect } from './database';
import { createExpressApp } from './server';
import { sessionStoreFactory } from './authentication';

export async function start(): Promise<Server> {
  const config = configuration();
  const { PORT } = config;
  const sessionStore = sessionStoreFactory(config);
  await connect(config);
  const app = createExpressApp(config, sessionStore);
  const server = createServer(app);
  server.listen(PORT, () => console.log(`Flint messenger listening at ${PORT}`));
  return server;
}
