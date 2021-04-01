import { CreateSpecificationController } from '@modules/cars/useCases/createSpecification/CreateSpecificationController';
import { Router } from 'express';

import { ensureAuthentication } from '../middlewares/ensureAuthentication';

const specificationRoutes = Router();

const createSpecificationController = new CreateSpecificationController();

specificationRoutes.use(ensureAuthentication);
specificationRoutes.post('/', createSpecificationController.handle);

export { specificationRoutes };
