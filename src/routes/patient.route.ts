import { Router } from 'express';

import { patientController } from '../controllers/patient.controller';
import { validate } from '../middlewares/validate';
import {
  createPatientSchema,
  patientIdParam,
  updatePatientSchema,
} from '../validations/patient.validation';

const router = Router();

router.get('/', patientController.list);
router.get('/:id', validate({ params: patientIdParam }), patientController.getById);
router.post('/', validate({ body: createPatientSchema }), patientController.create);
router.put(
  '/:id',
  validate({ params: patientIdParam, body: updatePatientSchema }),
  patientController.update,
);
router.delete('/:id', validate({ params: patientIdParam }), patientController.remove);

export { router as patientRouter };