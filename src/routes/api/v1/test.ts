import Food from '../../../models/FatSecret/Food';
import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
const router = Router();

router.route('/api/v1/test/:example').get((req: Request, res: Response) => {
  const example1Path = path.join(__dirname, `../../../../models/FatSecret/${req.params.example}.json`);
  const example1 = JSON.parse(fs.readFileSync(example1Path, 'utf-8'));
  const food1 = new Food(example1.food);
  console.log('Food 1:', food1);

  res.json(food1);
});



export default router;