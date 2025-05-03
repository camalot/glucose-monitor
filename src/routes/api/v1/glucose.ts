import GlucoseController from '../../../api/v1/controllers/GlucoseController'
import { Router, Request, Response, NextFunction } from 'express';
const router = Router();

const glucoseController = new GlucoseController();

router.route('/api/v1/glucose')
  .get(
    (req: Request, resp: Response, next: NextFunction) => {
      glucoseController.get(req, resp, next).catch(next);
    })
  .post((req: Request, resp: Response, next: NextFunction) => {
    glucoseController.record(req, resp, next).catch(next);
  });

router.route('/api/v1/glucose/chart')
  .get(
    (req: Request, resp: Response, next: NextFunction) => {
      glucoseController.chart(req, resp, next).catch(next);
    }
  );

router.route('/api/v1/glucose/last')
  .get(
    (req: Request, resp: Response, next: NextFunction) => {
      glucoseController.last(req, resp, next).catch(next);
    }
  );

router.route('/api/v1/glucose/a1c')
  .get(
    (req: Request, resp: Response, next: NextFunction) => {
      glucoseController.a1c(req, resp, next).catch(next);
    }
  );

export default router;
