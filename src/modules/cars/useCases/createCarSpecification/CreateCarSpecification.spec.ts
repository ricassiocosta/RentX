import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { SpecificationRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationRepositoryInMemory';

import { AppError } from '@shared/errors/AppError';

import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationRepositoryInMemory;
describe('create car specification', () => {
  beforeEach(() => {
    specificationsRepositoryInMemory = new SpecificationRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    );
  });
  it('should not be able to add a new specification to non-existent car', async () => {
    expect(async () => {
      const car_id = '1234';
      const specifications_id = ['45612'];
      await createCarSpecificationUseCase.execute({
        car_id,
        specifications_id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to add a new specification to a car', async () => {
    await carsRepositoryInMemory.create({
      name: 'Car name',
      brand: 'Car brand',
      category_id: 'category_id',
      daily_rate: 100,
      description: 'Car description',
      fine_amount: 100,
      license_plate: 'CAR1234',
    });

    await specificationsRepositoryInMemory.create({
      description: 'test',
      name: 'test',
    });

    const car = await carsRepositoryInMemory.findByLicensePlate('CAR1234');
    const specification = await specificationsRepositoryInMemory.findByName(
      'test'
    );

    const specifications_id = [specification.id];
    await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id,
    });

    const updatedCar = await carsRepositoryInMemory.findByLicensePlate(
      'CAR1234'
    );

    expect(updatedCar).toHaveProperty('specifications');
    expect(updatedCar.specifications.length).toBe(1);
  });
});
