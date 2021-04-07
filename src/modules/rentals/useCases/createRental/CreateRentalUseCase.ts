import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';

import { AppError } from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

class CreateRentalUseCase {
  constructor(private rentalsRepository: IRentalsRepository) {}
  async execute({
    user_id,
    car_id,
    expected_return_date,
  }: IRequest): Promise<void> {
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

    await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });
  }
}

export { CreateRentalUseCase };
