import { Router } from 'express';

import { patientRouter } from './patient.route';

const router = Router();

router.use('/patients', patientRouter);

export { router as apiRouter };