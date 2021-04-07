import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';

import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
describe('Create rental', () => {
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory);
  });

  it('should be able to create a new rental', async () => {
    await createRentalUseCase.execute({
      user_id: 'user_1_id',
      car_id: 'car_1_id',
      expected_return_date: new Date(),
    });

    const rental = await rentalsRepositoryInMemory.findOpenRentalByCarId(
      'car_1_id'
    );

    expect(rental).toHaveProperty('id');
  });

  it(`should not to be able to create a new rental
      if there is another open rental to the same user`, async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: 'user_2_id',
        car_id: 'car_2_id',
        expected_return_date: new Date(),
      });

      await createRentalUseCase.execute({
        user_id: 'user_2_id',
        car_id: 'car_3_id',
        expected_return_date: new Date(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not to be able to rent a already rented car', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: 'user_3_id',
        car_id: 'car_4_id',
        expected_return_date: new Date(),
      });

      await createRentalUseCase.execute({
        user_id: 'user_4_id',
        car_id: 'car_4_id',
        expected_return_date: new Date(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
