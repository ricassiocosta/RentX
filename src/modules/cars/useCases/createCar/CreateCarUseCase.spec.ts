import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { AppError } from '@shared/errors/AppError';

import { CreateCarUseCase } from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carsRepository: CarsRepositoryInMemory;
describe('Create car', () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepository);
  });
  it('should be able to create a new car', async () => {
    await createCarUseCase.execute({
      name: 'Car name',
      brand: 'Car brand',
      category_id: 'category_id',
      daily_rate: 100,
      description: 'Car description',
      fine_amount: 100,
      license_plate: 'CAR1234',
    });
  });

  it('should not to be able to register an already registered car', async () => {
    await createCarUseCase.execute({
      name: 'Car name',
      brand: 'Car brand',
      category_id: 'category_id',
      daily_rate: 100,
      description: 'Car description',
      fine_amount: 100,
      license_plate: 'CAR1234',
    });

    await expect(
      createCarUseCase.execute({
        name: 'Duplicated car',
        brand: 'Car brand',
        category_id: 'category_id',
        daily_rate: 100,
        description: 'Car description',
        fine_amount: 100,
        license_plate: 'CAR1234',
      })
    ).rejects.toEqual(new AppError('Car already registered'));
  });

  it('should only be able to create a available car', async () => {
    await createCarUseCase.execute({
      name: 'Car name',
      brand: 'Car brand',
      category_id: 'category_id',
      daily_rate: 100,
      description: 'Car description',
      fine_amount: 100,
      license_plate: 'CAR1234',
    });

    const car = await carsRepository.findByLicensePlate('CAR1234');
    expect(car.available).toBe(true);
  });
});
