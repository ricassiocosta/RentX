import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';
import { IDateProvider } from '@shared/providers/DateProvider/IDateProvider';

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
    @inject('CarsRepository')
    private carsRepository: ICarsRepository
  ) {}
  async execute({
    user_id,
    car_id,
    expected_return_date,
  }: IRequest): Promise<void> {
    const minimumRentalTime = 24;
    const carUnavailable = await this.rentalsRepository.findOpenRentalByCarId(
      car_id
    );
    if (carUnavailable) {
      throw new AppError('car is unavailable');
    }

    const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUserId(
      user_id
    );

    if (rentalOpenToUser) {
      throw new AppError("There's a rental in progress for user!");
    }

    const compare = this.dateProvider.compareInHours(
      new Date(),
      expected_return_date
    );

    if (compare < minimumRentalTime) {
      throw new AppError('A rent must be at least for 24 hours');
    }

    await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    await this.carsRepository.updateAvailable(car_id, false);
  }
}

export { CreateRentalUseCase };
