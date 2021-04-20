import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection, createConnection, getConnectionOptions } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { app } from '@shared/infra/http/app';

let connection: Connection;
describe('Create category controller', () => {
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

  it('should be able to create a new category', async () => {
    let response = await request(app).post('/sessions').send({
      email: 'admin@rentx.com',
      password: 'admin',
    });

    const { token } = response.body;

    response = await request(app)
      .post('/categories')
      .send({
        name: 'category 1 name',
        description: 'category 1 description',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it('should not be able to create a duplicated category', async () => {
    let response = await request(app).post('/sessions').send({
      email: 'admin@rentx.com',
      password: 'admin',
    });

    const { token } = response.body;

    response = await request(app)
      .post('/categories')
      .send({
        name: 'category 1 name',
        description: 'category 1 description',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });
});
