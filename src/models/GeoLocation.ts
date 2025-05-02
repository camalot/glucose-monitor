export default class GeoLocation {
  city: string;
  zip: string;

  constructor(city: string, zip: string) {
    this.city = city;
    this.zip = zip;
  }
  
  static fromApiResponse(data: any): GeoLocation {
    return new GeoLocation(data.city, data.zip);
  }
}