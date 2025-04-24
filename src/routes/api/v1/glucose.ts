import GlucoseController from '../../../api/v1/controllers/GlucoseController'
import { Router, Request, Response } from 'express';
const router = Router();

const glucoseController = new GlucoseController();

router.route('/api/v1/glucose')
  .get(glucoseController.get);

export default router;
