import auth from '@config/auth';
import { IUserTokensRepository } from '@modules/accounts/repositories/IUserTokensRepository';
import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';
import { IDateProvider } from '@shared/providers/DateProvider/IDateProvider';

interface IDecodedToken {
  sub: string;
  email: string;
}

@injectable()
class RefreshTokenUserCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUserTokensRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute(token: string): Promise<string> {
    const { email, sub: user_id } = verify(
      token,
      auth.secret_refresh_token
    ) as IDecodedToken;

    const userToken = await this.usersTokensRepository.findByUserIdAndRefreshToken(
      user_id,
      token
    );

    if (!userToken) {
      throw new AppError('Refresh token does not exists!');
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const refresh_token = sign({ email }, auth.secret_refresh_token, {
      subject: user_id,
      expiresIn: auth.expires_in_refresh_token,
    });

    const expires_date = this.dateProvider.addDays(
      auth.expires_refresh_token_days
    );

    await this.usersTokensRepository.create({
      expires_date,
      refresh_token,
      user_id,
    });

    return refresh_token;
  }
}

export { RefreshTokenUserCase };
