
import config from '../config';
import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  res.render("index", { title: 'Home' });
});

export default router;

// const config = require('../config');
// const { Router } = require('express');
// const SettingsMongoClient = require('../libs/mongo/Settings')

// const router = Router();


// router.get('/', async (req, resp) => {
//   await resp.render("index", {});
// });

// module.exports = router;