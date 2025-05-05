import GeoLocation from "../../models/GeoLocation";

describe("GeoLocation Class", () => {
  const mockGeoLocationData: GeoLocation = {
    status: "success",
    country: "United States",
    countryCode: "US",
    region: "TX",
    regionName: "Texas",
    city: "Waco",
    zip: "76710",
    lat: 31.559814,
    lon: -97.141800,
    timezone: "America/Chicago",
    isp: "AT&T Enterprises, LLC",
    org: "AT&T Internet Services",
    as: "AS7018 AT&T Enterprises, LLC",
    query: "1.1.1.1",
  };

  it("should initialize correctly with valid data", () => {
    const geoLocation = new GeoLocation(mockGeoLocationData);

    expect(geoLocation.status).toBe("success");
    expect(geoLocation.country).toBe("United States");
    expect(geoLocation.city).toBe("Waco");
    expect(geoLocation.zip).toBe("76710");
    expect(geoLocation.lat).toBe(31.559814);
    expect(geoLocation.lon).toBe(-97.141800);
    expect(geoLocation.query).toBe("1.1.1.1");
  });

  it("should return an empty GeoLocation object when using empty()", () => {
    const emptyGeoLocation = GeoLocation.empty();

    expect(emptyGeoLocation.status).toBe("fail");
    expect(emptyGeoLocation.country).toBe("");
    expect(emptyGeoLocation.city).toBe("");
    expect(emptyGeoLocation.zip).toBe("");
    expect(emptyGeoLocation.lat).toBe(0);
    expect(emptyGeoLocation.lon).toBe(0);
  });

  it("should create a GeoLocation object from API response using fromApiResponse()", () => {
    const geoLocation = GeoLocation.fromApiResponse(mockGeoLocationData);

    expect(geoLocation).toBeInstanceOf(GeoLocation);
    expect(geoLocation.city).toBe("Waco");
    expect(geoLocation.region).toBe("TX");
  });

  it("should create a GeoLocation object from JSON using fromJson()", () => {
    const json = JSON.stringify(mockGeoLocationData);
    const geoLocation = GeoLocation.fromJson(json);

    expect(geoLocation).toBeInstanceOf(GeoLocation);
    expect(geoLocation.city).toBe("Waco");
    expect(geoLocation.country).toBe("United States");
  });

  it("should convert a GeoLocation object to JSON using toJson()", () => {
    const geoLocation = new GeoLocation(mockGeoLocationData);
    const json = GeoLocation.toJson(geoLocation);

    expect(json).toBe(JSON.stringify(mockGeoLocationData));
  });

  it("should return a formatted string representation using toString()", () => {
    const geoLocation = new GeoLocation(mockGeoLocationData);
    const result = geoLocation.toString();

    expect(result).toBe("Waco, TX, United States");
  });

  it("should return an empty string from toString() if status is 'fail'", () => {
    const geoLocation = GeoLocation.empty();
    const result = geoLocation.toString();

    expect(result).toBe("");
  });

  it("should handle missing fields gracefully in toString()", () => {
    const partialData = {
      status: "success",
      city: "Austin",
      region: "",
      country: "United States",
    } as GeoLocation;

    const geoLocation = new GeoLocation(partialData);
    const result = geoLocation.toString();

    expect(result).toBe("Austin, United States");
  });
});