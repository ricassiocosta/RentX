import { hash } from 'bcrypt';
import { createConnection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

async function create() {
  const connection = await createConnection();

  const id = uuidV4();
  const password = await hash('admin', 8);

  await connection.query(
    `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
      values('${id}', 'admin', 'admin@rentx.com', '${password}', true, 'now()', 'ABC1234')
    `
  );

  await connection.close();
}

create().then(() => console.log('Admin user created!'));
