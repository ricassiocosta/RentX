import { CreateRentalController } from '@modules/rentals/useCases/createRental/CreateRentalController';
import { Router } from 'express';

import { ensureAuthentication } from '../middlewares/ensureAuthentication';

const rentalRoutes = Router();

const createRentalController = new CreateRentalController();

rentalRoutes.post('/', ensureAuthentication, createRentalController.handle);

export { rentalRoutes };
