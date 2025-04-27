import { Router, Request, Response } from 'express';
import moment from 'moment-timezone'
import * as fs from 'fs';
import * as path from 'path';
const router = Router();

router.route('/api/v1/test/').get((req: Request, resp: Response) => {
  let timezone = String(req.query.tz || 'UTC');
  let timestamps = [
    1745499600,
    1745556478,
    1745584500,
    1745587423,
    1745764200
  ];

  let result: any[] = []; 
  for (let timestamp of timestamps) {
    let converted = moment.unix(timestamp).tz(timezone);
    let offset = converted.utcOffset();
    // adjust for the offset

    // converted.add(offset, 'minutes');
    result.push({
      timezone: timezone,
      timestamp: timestamp * 1000,
      formatted: converted.format(),
      offset: converted.format('Z')
    });
  }
  resp.json(result);
});



export default router;