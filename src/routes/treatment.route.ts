import { Router } from 'express';

import { treatmentController } from '../controllers/treatment.controller';
import { validate } from '../middlewares/validate';
import {
  createTreatmentSchema,
  treatmentIdParam,
  updateTreatmentSchema,
} from '../validations/treatment.validation';

const router = Router();

router.get('/', treatmentController.list);
router.get('/:id', validate({ params: treatmentIdParam }), treatmentController.getById);
router.post('/', validate({ body: createTreatmentSchema }), treatmentController.create);
router.put(
  '/:id',
  validate({ params: treatmentIdParam, body: updateTreatmentSchema }),
  treatmentController.update,
);
router.delete('/:id', validate({ params: treatmentIdParam }), treatmentController.remove);

export { router as treatmentRouter };
