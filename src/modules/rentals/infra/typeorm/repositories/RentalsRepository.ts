import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { getRepository, Repository } from 'typeorm';

import { Rental } from '../entities/Rental';

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;
  constructor() {
    this.repository = getRepository(Rental);
  }

  async findOpenRentalByCarId(car_id: string): Promise<Rental> {
    const openByCar = await this.repository.findOne({ car_id });
    return openByCar;
  }

  async findOpenRentalByUserId(user_id: string): Promise<Rental> {
    const openByUser = await this.repository.findOne({ user_id });
    return openByUser;
  }

  async create({
    user_id,
    car_id,
    expected_return_date,
  }: ICreateRentalDTO): Promise<void> {
    const rental = this.repository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    this.repository.save(rental);
  }
}

export { RentalsRepository };
