import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import dayjs from 'dayjs';
import { v4 as uuidV4 } from 'uuid';

import { AppError } from '@shared/errors/AppError';
import { DayjsDateProvider } from '@shared/providers/DateProvider/implementations/DayjsDateProvider';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dateProvider: DayjsDateProvider;
describe('Create rental', () => {
  const add24Hours = dayjs().add(1, 'day').toDate();
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dateProvider,
      carsRepositoryInMemory
    );
  });

  it('should be able to create a new rental', async () => {
    await carsRepositoryInMemory.create({
      id: uuidV4(),
      name: 'car name',
      brand: 'car brand',
      category_id: 'category id',
      daily_rate: 100,
      description: 'description',
      fine_amount: 100,
      license_plate: 'license_plate',
    });

    const car = await carsRepositoryInMemory.findByLicensePlate(
      'license_plate'
    );

    await createRentalUseCase.execute({
      user_id: 'user_1_id',
      car_id: car.id,
      expected_return_date: add24Hours,
    });

    const rental = await rentalsRepositoryInMemory.findOpenRentalByCarId(
      car.id
    );

    expect(rental).toHaveProperty('id');
  });

  it(`should not to be able to create a new rental
      if there is another open rental to the same user`, async () => {
    await carsRepositoryInMemory.create({
      id: uuidV4(),
      name: 'car name',
      brand: 'car brand',
      category_id: 'category id',
      daily_rate: 100,
      description: 'description',
      fine_amount: 100,
      license_plate: 'license_plate',
    });

    await carsRepositoryInMemory.create({
      id: uuidV4(),
      name: 'car name',
      brand: 'car brand',
      category_id: 'category id',
      daily_rate: 100,
      description: 'description',
      fine_amount: 100,
      license_plate: 'license_plate2',
    });

    const car = await carsRepositoryInMemory.findByLicensePlate(
      'license_plate'
    );

    const car2 = await carsRepositoryInMemory.findByLicensePlate(
      'license_plate2'
    );

    await createRentalUseCase.execute({
      user_id: 'user_2_id',
      car_id: car.id,
      expected_return_date: add24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: 'user_2_id',
        car_id: car2.id,
        expected_return_date: add24Hours,
      })
    ).rejects.toEqual(new AppError("There's a rental in progress for user!"));
  });

  it('should not to be able to rent a already rented car', async () => {
    await carsRepositoryInMemory.create({
      id: uuidV4(),
      name: 'car name',
      brand: 'car brand',
      category_id: 'category id',
      daily_rate: 100,
      description: 'description',
      fine_amount: 100,
      license_plate: 'license_plate',
    });

    const car = await carsRepositoryInMemory.findByLicensePlate(
      'license_plate'
    );

    await createRentalUseCase.execute({
      user_id: 'user_3_id',
      car_id: car.id,
      expected_return_date: add24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: 'user_4_id',
        car_id: car.id,
        expected_return_date: add24Hours,
      })
    ).rejects.toEqual(new AppError('car is unavailable'));
  });

  it('should only to be able to rent a car for at least for 24 hours', async () => {
    await carsRepositoryInMemory.create({
      id: uuidV4(),
      name: 'car name',
      brand: 'car brand',
      category_id: 'category id',
      daily_rate: 100,
      description: 'description',
      fine_amount: 100,
      license_plate: 'license_plate',
    });

    const car = await carsRepositoryInMemory.findByLicensePlate(
      'license_plate'
    );

    await expect(
      createRentalUseCase.execute({
        user_id: 'user_4_id',
        car_id: car.id,
        expected_return_date: new Date(),
      })
    ).rejects.toEqual(new AppError('A rent must be at least for 24 hours'));
  });
});
