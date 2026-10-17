import { Router } from 'express';

import { dentistController } from '../controllers/dentist.controller';
import { validate } from '../middlewares/validate';
import {
  createDentistSchema,
  dentistIdParam,
  updateDentistSchema,
} from '../validations/dentist.validation';

const router = Router();

router.get('/', dentistController.list);
router.get('/:id', validate({ params: dentistIdParam }), dentistController.getById);
router.post('/', validate({ body: createDentistSchema }), dentistController.create);
router.put(
  '/:id',
  validate({ params: dentistIdParam, body: updateDentistSchema }),
  dentistController.update,
);
router.delete('/:id', validate({ params: dentistIdParam }), dentistController.remove);

export { router as dentistRouter };
