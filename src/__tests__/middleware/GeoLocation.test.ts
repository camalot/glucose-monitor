import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import GeoLocation from '../../middleware/GeoLocation';
import GeoLocationModel from '../../models/GeoLocation';
import { Socket } from 'node:net';
import { create } from 'node:domain';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

function createGeoLocation(data: Partial<GeoLocationModel>): GeoLocationModel {
  return {
    status: data.status || 'fail',
    country: data.country || '',
    countryCode: data.countryCode || '',
    region: data.region || '',
    regionName: data.regionName || '',
    city: data.city || '',
    zip: data.zip || '',
    lat: data.lat || 0,
    lon: data.lon || 0,
    timezone: data.timezone || '',
    isp: data.isp || '',
    org: data.org || '',
    as: data.as || '',
    query: data.query || '',
  };
}

describe('GeoLocation Middleware', () => {
  let req: Partial<Request>;
  let resp: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
      socket: {
        remoteAddress: '127.0.0.1',
        destroySoon: jest.fn(), // Mock required method
        destroy: jest.fn(), // Mock required method
        setTimeout: jest.fn(), // Mock required method
        // Add other required methods or properties as needed
      } as unknown as Socket, // Cast to Socket
    };
    resp = {
      locals: {},
    } as Partial<Response> as Response;
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should fetch geolocation and set it in resp.locals.geoLocation', async () => {
    const mockGeoLocationData = createGeoLocation({
      status: 'success' as 'success' | 'fail',
      country: 'USA',
      countryCode: 'US',
      region: 'California',
      regionName: 'California',
      city: 'Los Angeles',
      zip: '90001',
      lat: 34.0522,
      lon: -118.2437,
      timezone: 'America/Los_Angeles',
      isp: 'Mock ISP',
      org: 'Mock Org',
      as: 'Mock AS',
      query: '127.0.0.1',
    });

    mockedAxios.get.mockResolvedValueOnce({ data: mockGeoLocationData });
    const geoLocationMiddleware = new GeoLocation();

    await geoLocationMiddleware.get(req as Request, resp as Response, next);

    expect(mockedAxios.get).toHaveBeenCalledWith('http://ip-api.com/json/127.0.0.1', { timeout: 1000 });
    expect(resp.locals?.geoLocation).toEqual(GeoLocationModel.fromApiResponse(mockGeoLocationData));
    expect(next).toHaveBeenCalled();
  });

  it('should set an empty GeoLocation if the API response is incomplete', async () => {
    const mockIncompleteGeoLocationData = {
      status: 'success',
      country: 'USA',
      countryCode: 'US',
      region: null,
      city: null,
      zip: null,
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockIncompleteGeoLocationData });
    const geoLocationMiddleware = new GeoLocation();

    await geoLocationMiddleware.get(req as Request, resp as Response, next);

    expect(mockedAxios.get).toHaveBeenCalledWith('http://ip-api.com/json/127.0.0.1', { timeout: 1000 });
    expect(resp.locals?.geoLocation).toEqual(GeoLocationModel.empty());
    expect(next).toHaveBeenCalled();
  });

  it('should set an empty GeoLocation and call next() if the API request fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
    const geoLocationMiddleware = new GeoLocation();

    await geoLocationMiddleware.get(req as Request, resp as Response, next);

    expect(mockedAxios.get).toHaveBeenCalledWith('http://ip-api.com/json/127.0.0.1', { timeout: 1000 });
    expect(resp.locals?.geoLocation).toEqual(GeoLocationModel.empty());
    expect(next).toHaveBeenCalled();
  });

  it('should use x-forwarded-for header if available', async () => {
    req.headers ? req.headers['x-forwarded-for'] = '192.168.1.1' : req.headers = { 'x-forwarded-for': '192.168.1.1' };
    const mockGeoLocationData = createGeoLocation({
      status: 'success',
      country: 'USA',
      countryCode: 'US',
      region: 'California',
      regionName: 'California',
      city: 'Los Angeles',
      zip: '90001',
      lat: 34.0522,
      lon: -118.2437,
      timezone: 'America/Los_Angeles',
      isp: 'Mock ISP',
      org: 'Mock Org',
      as: 'Mock AS',
      query: '192.168.1.1',
    });

    mockedAxios.get.mockResolvedValueOnce({ data: mockGeoLocationData });
    const geoLocationMiddleware = new GeoLocation();

    await geoLocationMiddleware.get(req as Request, resp as Response, next);

    expect(mockedAxios.get).toHaveBeenCalledWith('http://ip-api.com/json/192.168.1.1', { timeout: 1000 });
    expect(resp.locals?.geoLocation).toEqual(GeoLocationModel.fromApiResponse(mockGeoLocationData));
    expect(next).toHaveBeenCalled();
  });
});