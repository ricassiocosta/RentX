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
    const openRental = await this.repository.findOne({
      where: {
        car_id,
        end_date: null,
      },
    });
    return openRental;
  }

  async findOpenRentalByUserId(user_id: string): Promise<Rental> {
    const openRental = await this.repository.findOne({
      where: {
        user_id,
        end_date: null,
      },
    });
    return openRental;
  }

  async create({
    user_id,
    car_id,
    expected_return_date,
    id,
    end_date,
    total,
  }: ICreateRentalDTO): Promise<void> {
    const rental = this.repository.create({
      user_id,
      car_id,
      expected_return_date,
      end_date,
      total,
      id,
    });

    this.repository.save(rental);
  }

  async findById(id: string): Promise<Rental> {
    const rental = await this.repository.findOne(id);
    return rental;
  }
}

export { RentalsRepository };
