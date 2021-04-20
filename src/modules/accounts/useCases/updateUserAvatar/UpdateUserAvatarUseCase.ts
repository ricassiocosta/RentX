import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';

import { IStorageProvider } from '@shared/providers/StorageProvider/IStorageProvider';

interface IRequest {
  userId: string;
  avatarFile: string;
}

@injectable()
class UpdateUserUserAvatarUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  async execute({ userId, avatarFile }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (user.avatar) {
      await this.storageProvider.delete(user.avatar, 'avatar');
    }

    await this.storageProvider.save(avatarFile, 'avatar');

    user.avatar = avatarFile;

    await this.usersRepository.create(user);
  }
}

export { UpdateUserUserAvatarUseCase };
