import HealthRouter from './health';
import ApiV1ConfigRouter from './api/v1/config';
import TestRouter from './api/v1/test';
import HomeRouter from './home';
import ApiV1GlucoseRouter from './api/v1/glucose';
import ApiV1FoodRouter from './api/v1/food';
import ApiV1WeightRouter from './api/v1/weight';

import config from '../config';
import { Router } from 'express';

const router: Router = Router();

router.use('/', HealthRouter);
router.use('/', ApiV1ConfigRouter);
router.use('/', HomeRouter);
router.use('/', ApiV1GlucoseRouter);

router.use('/', TestRouter);

router.use('/', ApiV1FoodRouter);
router.use('/', ApiV1WeightRouter);

export default router;
