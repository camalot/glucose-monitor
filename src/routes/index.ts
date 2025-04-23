import HealthRouter from './health';
import ApiV1ConfigRouter from './api/v1/config';
import HomeRouter from './home';
// import ApiV1FoodRouter from './api/v1/food.ts.ignore';

import config from '../config';
import { Router } from 'express';

const router: Router = Router();

router.use('/', HealthRouter);
router.use('/', ApiV1ConfigRouter);
router.use('/', HomeRouter);
// router.use('/', ApiV1FoodRouter);

export default router;

// const HealthRouter = require('./health');
// const ApiV1ConfigRouter = require('./api/v1/config');

// const HomeRouter = require('./home');
// const ApiV1FoodRouter = require('./api/v1/food');

// const config = require('../config');
// const { Router } = require('express');

// const router = Router();

// router.use('/', HealthRouter);
// router.use('/', ApiV1ConfigRouter);
// router.use('/', HomeRouter);
// router.use('/', ApiV1FoodRouter);

// module.exports = router;
