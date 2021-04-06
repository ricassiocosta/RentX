import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
describe('List cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory
    );
  });
  it('should be able to list all available cars', async () => {
    await carsRepositoryInMemory.create({
      name: 'Car name',
      brand: 'Car brand',
      category_id: 'category_id',
      daily_rate: 100,
      description: 'Car description',
      fine_amount: 100,
      license_plate: 'CAR1234',
    });

    await carsRepositoryInMemory.create({
      name: 'Car 2 name',
      brand: 'Car brand',
      category_id: 'category_id',
      daily_rate: 100,
      description: 'Car description',
      fine_amount: 100,
      license_plate: 'CAR1234',
    });

    const cars = await listAvailableCarsUseCase.execute({});
    expect(cars).toHaveLength(2);
  });

  it('should be able to list all available cars by brand', async () => {
    await carsRepositoryInMemory.create({
      name: 'Car name',
      brand: 'Car brand test',
      category_id: 'category_id',
      daily_rate: 100,
      description: 'Car description',
      fine_amount: 100,
      license_plate: 'CAR1234',
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: 'Car brand test',
    });
    expect(cars).toHaveLength(1);
  });

  it('should be able to list all available cars by name', async () => {
    await carsRepositoryInMemory.create({
      name: 'Car 3 name',
      brand: 'Car brand test',
      category_id: 'category_id',
      daily_rate: 100,
      description: 'Car description',
      fine_amount: 100,
      license_plate: 'CAR1234',
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: 'Car 3 name',
    });
    expect(cars).toHaveLength(1);
  });

  it('should be able to list all available cars by category', async () => {
    await carsRepositoryInMemory.create({
      name: 'Car 4 name',
      brand: 'Car brand test',
      category_id: 'category_id_test',
      daily_rate: 100,
      description: 'Car description',
      fine_amount: 100,
      license_plate: 'CAR1234',
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: 'category_id_test',
    });
    expect(cars).toHaveLength(1);
  });
});
