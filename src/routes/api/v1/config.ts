import ScriptsController from '../../../api/v1/controllers/ScriptsController';
import { Router, Request, Response } from 'express';


const router = Router();

router.route('/assets/javascript/config.js')
  .get(ScriptsController.config);

router.route('/assets/javascript/scripts.js')
  .get(ScriptsController.scripts);

export default router;