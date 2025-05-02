import axios from 'axios';
import GeoLocationModel from '../models/GeoLocation';

export class GeoLocation {
  async get(ip: string): Promise<GeoLocationModel> {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    const result: GeoLocationModel = GeoLocationModel.fromApiResponse(response.data);

    if (!result || !result.city || !result.zip) {
      throw new Error('Unable to retrieve location data.');
    }

    return result;
  } catch (error) {
    console.error('Error fetching geolocation:', error);
    throw new Error('Failed to fetch geolocation.');
  }
}
}