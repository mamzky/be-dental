import { Router } from 'express';

import { medicalRecordController } from '../controllers/medical-record.controller';
import { validate } from '../middlewares/validate';
import {
  createMedicalRecordSchema,
  medicalRecordIdParam,
  updateMedicalRecordSchema,
} from '../validations/medical-record.validation';

const router = Router();

router.get('/', medicalRecordController.list);
router.get(
  '/:id',
  validate({ params: medicalRecordIdParam }),
  medicalRecordController.getById,
);
router.post('/', validate({ body: createMedicalRecordSchema }), medicalRecordController.create);
router.put(
  '/:id',
  validate({ params: medicalRecordIdParam, body: updateMedicalRecordSchema }),
  medicalRecordController.update,
);
router.delete(
  '/:id',
  validate({ params: medicalRecordIdParam }),
  medicalRecordController.remove,
);

export { router as medicalRecordRouter };
