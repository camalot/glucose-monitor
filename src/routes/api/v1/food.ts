import FoodController from '../../../api/v1/controllers/FoodController';
import { Router, Request, Response, NextFunction } from 'express';


const router = Router();
const foodController = new FoodController();

router.route('/api/v1/food/autocomplete')
  .get((req: Request, resp: Response, next: NextFunction ) => {
    foodController.autocomplete(req, resp, next);
  });

router.route('/api/v1/food/search/:query')
  .get((req: Request, resp: Response, next: NextFunction) => {
    foodController.search(req.params.query)
      .then(response => resp.json(response))
      .catch(next);
  });

// router.route('/api/v1/food/:id')
//   .get((req: Request, resp: Response, next: NextFunction) => {
//     foodController.getById(req.params.id)
//       .then(response => resp.json(response))
//       .catch(next);
//   })
//   .delete((req: Request, resp: Response, next: NextFunction) => {
//     foodController.deleteById(req.params.id)
//       .then(() => resp.status(204).send())
//       .catch(next);
//   })
//   .put((req: Request, resp: Response, next: NextFunction) => {
//     foodController.updateById(req.params.id, req.body)
//       .then(response => resp.json(response))
//       .catch(next);
//   });

export default router;