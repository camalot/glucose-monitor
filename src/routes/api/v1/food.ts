import FoodController from '../../../api/v1/controllers/FoodController';
import { Router, Request, Response, NextFunction } from 'express';


const router = Router();
const foodController = new FoodController();

// requires premier scope.
router.route('/api/v1/food/autocomplete')
  .get((req: Request, res: Response, next: NextFunction) => {
    console.log("Received autocomplete request");
    foodController.autocomplete(req, res, next);
  });

// router.route('/api/v1/food/search/')
//   .get(foodController.search);

router.route('/api/v1/food/list/:count')
  .get((req: Request, res: Response, next: NextFunction) => {
    foodController.list(req, res, next);
  });

// router.route('/api/v1/food/:id')
//   .get(foodController.getById);


export default router;