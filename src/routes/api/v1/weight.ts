import WeightController from '../../../api/v1/controllers/WeightController';
import { Router, Request, Response, NextFunction } from 'express';


const router = Router();
const weightController = new WeightController();

// requires premier scope.
router.route('/api/v1/weight/chart')
  .get((req: Request, resp: Response, next: NextFunction) => {
    weightController.getChartData(req, resp, next).catch(next);
  });

router.route('/api/v1/weight')
  .post((req: Request, res: Response, next: NextFunction) => {
    weightController.record(req, res, next).catch(next);
  });


export default router;