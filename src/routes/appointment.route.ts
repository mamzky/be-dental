import { Router } from 'express';

import { appointmentController } from '../controllers/appointment.controller';
import { validate } from '../middlewares/validate';
import {
  appointmentIdParam,
  createAppointmentSchema,
  updateAppointmentSchema,
} from '../validations/appointment.validation';

const router = Router();

router.get('/', appointmentController.list);
router.get('/:id', validate({ params: appointmentIdParam }), appointmentController.getById);
router.post('/', validate({ body: createAppointmentSchema }), appointmentController.create);
router.put(
  '/:id',
  validate({ params: appointmentIdParam, body: updateAppointmentSchema }),
  appointmentController.update,
);
router.delete('/:id', validate({ params: appointmentIdParam }), appointmentController.remove);

export { router as appointmentRouter };
