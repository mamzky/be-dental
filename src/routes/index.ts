import { Router } from 'express';

import { appointmentRouter } from './appointment.route';
import { dentistRouter } from './dentist.route';
import { medicalRecordRouter } from './medical-record.route';
import { patientRouter } from './patient.route';
import { treatmentRouter } from './treatment.route';

const router = Router();

router.use('/patients', patientRouter);
router.use('/dentists', dentistRouter);
router.use('/treatments', treatmentRouter);
router.use('/appointments', appointmentRouter);
router.use('/medical-records', medicalRecordRouter);

export { router as apiRouter };
