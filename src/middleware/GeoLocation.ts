import axios from 'axios';
import GeoLocationModel from '../models/GeoLocation';
import { Request, Response, NextFunction } from 'express';

export default class GeoLocation {
  public async get(req: Request, resp: Response, next: NextFunction): Promise<void> {
  try {
    // get the users ip address
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress ;

    const response = await axios.get(`http://ip-api.com/json/${ip}`, { timeout: 1000 });
    const result: GeoLocationModel = GeoLocationModel.fromApiResponse(response.data);

    if (!result || !result.city || !result.zip || !result.region) {
      resp.locals.geoLocation = GeoLocationModel.empty();
      return next();
    }

    resp.locals.geoLocation = result;
    return next(); // Ensure to call next() to proceed to the next middleware
  } catch (error) {
    // console.error('Error fetching geolocation:', error);
    resp.locals.geoLocation = GeoLocationModel.empty();
    next();
  }
}
}