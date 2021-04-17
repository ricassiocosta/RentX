import auth from '@config/auth';
import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import { UsersTokensRepository } from '@modules/accounts/infra/typeorm/repositories/UsersTokensRepository';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { AppError } from '@shared/errors/AppError';

interface IPayload {
  sub: string;
}

export async function ensureAuthentication(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = request.headers.authorization;
  const usersTokensRepository = new UsersTokensRepository();

  if (!authHeader) {
    throw new AppError('Token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: userId } = verify(
      token,
      auth.secret_refresh_token
    ) as IPayload;

    const user = usersTokensRepository.findByUserIdAndRefreshToken(
      userId,
      token
    );
    if (!user) {
      throw new AppError('Invalid token', 401);
    }

    request.user = {
      id: userId,
    };

    next();
  } catch {
    throw new AppError('Invalid token', 401);
  }
}
