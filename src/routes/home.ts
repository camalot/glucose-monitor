
import config from '../config';
import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  res.render("index", { title: 'Home' });
});

export default router;
