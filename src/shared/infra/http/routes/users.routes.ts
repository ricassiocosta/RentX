import { CreateUserController } from '@modules/accounts/useCases/createUser/CreateUserController';
import { UpdateUserAvatarController } from '@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController';
import { UserProfileController } from '@modules/cars/useCases/userProfileUseCase/UserProfileController';
import { Router } from 'express';
import multer from 'multer';

import { ensureAuthentication } from '@shared/infra/http/middlewares/ensureAuthentication';

import uploadConfig from '../../../../config/upload';

const usersRoutes = Router();

const uploadAvatar = multer(uploadConfig);

const createUserController = new CreateUserController();
const updateUserAvatarController = new UpdateUserAvatarController();
const userProfileController = new UserProfileController();

usersRoutes.post('/', createUserController.handle);
usersRoutes.patch(
  '/avatar',
  ensureAuthentication,
  uploadAvatar.single('avatar'),
  updateUserAvatarController.handle
);
usersRoutes.get('/', ensureAuthentication, userProfileController.handle);

export { usersRoutes };
