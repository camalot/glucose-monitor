
// {"status":"success","country":"United States","countryCode":"US","region":"TX","regionName":"Texas","city":"Waco","zip":"76710","lat":31.559814,"lon":-97.141800,"timezone":"America/Chicago","isp":"AT\u0026T Enterprises, LLC","org":"AT\u0026T Internet Services","as":"AS7018 AT\u0026T Enterprises, LLC","query":"1.1.1.1"}
// {"status":"fail","message":"SSL unavailable for this endpoint, order a key at https://members.ip-api.com/"}
export default class GeoLocation {
  status: "success" | "fail";
  message?: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;

  constructor(options: GeoLocation ) {
    this.status = options.status;
    this.message = options.message;
    this.country = options.country;
    this.countryCode = options.countryCode;
    this.region = options.region;
    this.regionName = options.regionName;
    this.city = options.city;
    this.zip = options.zip;
    this.lat = options.lat;
    this.lon = options.lon;
    this.timezone = options.timezone;
    this.isp = options.isp;
    this.org = options.org;
    this.as = options.as;
    this.query = options.query;
  }
  
  static fromApiResponse(data: GeoLocation): GeoLocation {
    return new GeoLocation(data);
  }

  static empty(): GeoLocation {
    return new GeoLocation({
      status: "fail",
      country: "",
      countryCode: "",
      region: "",
      regionName: "",
      city: "",
      zip: "",
      lat: 0,
      lon: 0,
      timezone: "",
      isp: "",
      org: "",
      as: "",
      query: ""
    } as GeoLocation)
  }

  static fromJson(json: string): GeoLocation {
    const data = JSON.parse(json);
    return new GeoLocation(data);
  }

  static toJson(geoLocation: GeoLocation): string {
    return JSON.stringify(geoLocation);
  }

  toString(): string {
    if (this.status === "fail") {
      return "";
    }

    // include city, region, country with a comma after the city and region if they are not empty. 
    // dont include any of them if they are empty
    const parts: string[] = [];
    if (this.city) parts.push(this.city);
    if (this.region) parts.push(this.region);
    if (this.country) parts.push(this.country);

    return parts.join(', ');
  }

  
}