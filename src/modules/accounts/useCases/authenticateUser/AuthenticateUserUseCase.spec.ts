import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';

import { AppError } from '@shared/errors/AppError';
import { DayjsDateProvider } from '@shared/providers/DateProvider/implementations/DayjsDateProvider';

import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let createUserUseCase: CreateUserUseCase;
describe('Authenticate user', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();

    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider
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

  it('should not be able to authenticate an non-existent user', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'wrong@email.com',
        password: 'wrong_password',
      })
    ).rejects.toEqual(new AppError('Email or password incorrect!'));
  });

  it('should not be able to authenticate with incorrent password', async () => {
    const user: ICreateUserDTO = {
      name: 'Tester It',
      email: 'tester@test.com',
      password: '123567',
      driver_license: 'XPTO',
    };

    await createUserUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: 'wrong_password',
      })
    ).rejects.toEqual(new AppError('Email or password incorrect!'));
  });

  it('should not be able to authenticate with incorrent email', async () => {
    const user: ICreateUserDTO = {
      name: 'Tester It',
      email: 'tester@test.com',
      password: '123567',
      driver_license: 'XPTO',
    };

    await createUserUseCase.execute(user);
    expect(
      authenticateUserUseCase.execute({
        email: 'wrong@email.com',
        password: user.password,
      })
    ).rejects.toEqual(new AppError('Email or password incorrect!'));
  });
});
