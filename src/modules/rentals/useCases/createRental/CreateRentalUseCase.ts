import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { AppError } from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

dayjs.extend(utc);

class CreateRentalUseCase {
  constructor(private rentalsRepository: IRentalsRepository) {}
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

    const expectedDateFormat = dayjs(expected_return_date)
      .utc()
      .local()
      .format();

    const dateNow = dayjs().utc().local().format();

    const compare = dayjs(expectedDateFormat).diff(dateNow, 'hours');
    if (compare < minimumRentalTime) {
      throw new AppError('A rent must be at least for 24 hours');
    }

    await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });
  }
}

export { CreateRentalUseCase };
