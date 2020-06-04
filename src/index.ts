import { configuration } from './config';
import { connect } from './database';
import { createServer } from './server';

async function start(): Promise<void> {
  const config = configuration();
  const { PORT } = config;
  await connect(config);
  const app = createServer(config);
  app.listen(PORT, () => console.log(`Flint messenger listening at ${PORT}`));
}

start();
