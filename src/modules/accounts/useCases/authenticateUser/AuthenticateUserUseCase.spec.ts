import { AppError } from '@errors/AppError';
import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';

import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
describe('Authenticate user', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('should be able to authenticate an user', async () => {
    const user: ICreateUserDTO = {
      name: 'Tester It',
      email: 'tester@test.com',
      password: '123567',
      driver_license: 'XPTO',
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty('token');
  });

  it('should not be able to authenticate an non-existent user', () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'wrong@email.com',
        password: 'wrong_password',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with incorrent password', () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'Tester It',
        email: 'tester@test.com',
        password: '123567',
        driver_license: 'XPTO',
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: 'wrong_password',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with incorrent email', () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'Tester It',
        email: 'tester@test.com',
        password: '123567',
        driver_license: 'XPTO',
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: 'wrong@email.com',
        password: user.password,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
