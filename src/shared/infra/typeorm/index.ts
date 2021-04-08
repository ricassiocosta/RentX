import { createConnection, getConnectionOptions } from 'typeorm';

async function connect() {
  const defaultOptions = await getConnectionOptions();
  createConnection(
    Object.assign(defaultOptions, {
      database:
        process.env.NODE_ENV === 'test'
          ? 'rentx_test'
          : defaultOptions.database,
    })
  );
}

connect();
