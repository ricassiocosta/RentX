import { hash } from 'bcrypt';
import delay from 'delay';
import request from 'supertest';
import { Connection, createConnection, getConnectionOptions } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { app } from '@shared/infra/http/app';

let connection: Connection;
describe('List categories', () => {
  beforeAll(async () => {
    const defaultOptions = await getConnectionOptions();
    connection = await createConnection(
      Object.assign(defaultOptions, {
        database: 'rentx_test',
      })
    );

    await connection.runMigrations();

    const id = uuid();
    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
        values('${id}', 'admin', 'admin@rentx.com', '${password}', true, 'now()', 'ABC1234')
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to list all categories', async () => {
    let response = await request(app).post('/sessions').send({
      email: 'admin@rentx.com',
      password: 'admin',
    });

    const { token } = response.body;

    await request(app)
      .post('/categories')
      .send({
        name: 'category 1 name',
        description: 'category 1 description',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    await request(app)
      .post('/categories')
      .send({
        name: 'category 2 name',
        description: 'category 2 description',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    await delay(100);

    response = await request(app).get('/categories');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });
});
