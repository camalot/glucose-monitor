import FoodController from '../../../api/v1/controllers/FoodController';
import GeoLocation from '../../../middleware/GeoLocation';
import { Router, Request, Response, NextFunction } from 'express';


const router = Router();
const foodController = new FoodController();
const geoLocation = new GeoLocation();

// requires premier scope.
router.route('/api/v1/food/autocomplete')
  .get((req: Request, res: Response, next: NextFunction) => {
    console.log("Received autocomplete request");
    foodController.autocomplete(req, res, next).catch(next);
  });

router.route('/api/v1/food/search/')
  .get(geoLocation.get, (req: Request, res: Response, next: NextFunction) => {
    console.log("Received search request");
    foodController.search(req, res, next).catch(next);
  });

router.route('/api/v1/food/list/:count')
  .get((req: Request, res: Response, next: NextFunction) => {
    foodController.list(req, res, next).catch(next);
  });

router.route('/api/v1/food/carbs/today')
  .get((req: Request, res: Response, next: NextFunction) => {
    foodController.getTotalCarbsToday(req, res, next).catch(next);
  });

router.route('/api/v1/food/calories/today')
  .get((req: Request, res: Response, next: NextFunction) => {
    foodController.getTotalCaloriesToday(req, res, next).catch(next);
  });

// router.route('/api/v1/food/:id')
//   .get(foodController.getById);


export default router;