import FoodController from '../../../api/v1/controllers/FoodController';
import { Router, Request, Response, NextFunction } from 'express';


const router = Router();
const foodController = new FoodController();

// requires premier scope.
router.route('/api/v1/food/autocomplete')
  .get((req: Request, resp: Response, next: NextFunction ) => {
    foodController.autocomplete(req, resp, next);
  });

router.route('/api/v1/food/search/')
  .get((req: Request, resp: Response, next: NextFunction) => {
    foodController.search(req, resp, next);
  });

router.route('/api/v1/food/:id')
  .get((req: Request, resp: Response, next: NextFunction) => {
    foodController.getById(req, resp, next);
  });

export default router;