import GlucoseController from '../../../api/v1/controllers/GlucoseController'
import { Router, Request, Response } from 'express';
const router = Router();

const glucoseController = new GlucoseController();

router.route('/api/v1/glucose')
  .get(glucoseController.get);

router.route('/api/v1/glucose/chart')
  .get(glucoseController.chart);

router.route('/api/v1/glucose/last')
  .get(glucoseController.last);

router.route('/api/v1/glucose/a1c')
  .get(glucoseController.a1c);

export default router;
