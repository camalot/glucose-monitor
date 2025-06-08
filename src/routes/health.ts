import config from '../config';
import { Router, Request, Response } from 'express';
import SettingsMongoClient from '../libs/mongo/Settings';

const router = Router();

async function getHealth(req: Request, res: Response ) {
  try {
    let settingsClient = new SettingsMongoClient();
    await settingsClient.connect();
    await settingsClient.list();
    res.status(200).json({ status: 'ok' });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}

router.get('/health', getHealth);
router.get('/healthz', getHealth);
router.get('/livez', getHealth);
router.get('/readyz', getHealth);

export default router;

// const config = require('../config');
// const { Router } = require('express');
// const SettingsMongoClient = require('../libs/mongo/Settings')

// const router = Router();

// // create db call to check if can talk to db before giving OK
// async function getHealth(req, res) {
//   try {
//     let settingsClient = new SettingsMongoClient();
//     await settingsClient.connect();
//     await settingsClient.list();
//     await settingsClient.close();
//     res.status(200).json({ status: 'ok' });
//   } catch (err) {
//     res.status(500).json({ status: 'error', message: err.message });
//   }
// }

// router.get('/health', getHealth);
// router.get('/healthz', getHealth);
// router.get('/livez', getHealth);
// router.get('/readyz', getHealth);

// module.exports = router;