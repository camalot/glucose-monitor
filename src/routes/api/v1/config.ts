import ScriptsController from '../../../api/v1/controllers/ScriptsController';
import { Router, Request, Response, NextFunction } from 'express';


const router = Router();
const scriptsController = new ScriptsController();

router.route('/javascript/config.js')
  .get((req: Request, res: Response, next: NextFunction) => scriptsController.config(req, res, next).catch(next));

router.route('/javascript/scripts.js')
  .get((req: Request, res: Response, next: NextFunction) => scriptsController.scripts(req, res, next).catch(next));

export default router;