import {Configuration, LogConfiguration, LogLevel, LogLevelConfiguration, MongoConfiguration, UiConfiguration} from "../../models/Configuration";


describe("Configuration Class", () => {
  it("should initialize with default values", () => {
    const config = new Configuration();

    // Log Configuration
    expect(config.log).toBeInstanceOf(LogConfiguration);
    expect(config.log.level).toBeInstanceOf(LogLevelConfiguration);
    expect(config.log.level.db).toBe(LogLevel.WARN);
    expect(config.log.level.console).toBe(LogLevel.DEBUG);

    // Mongo Configuration
    expect(config.mongo.url).toBe("mongodb://localhost:27017");
    expect(config.mongo.database).toBe("mydatabase");

    // UI Configuration
    expect(config.ui.enabled).toBe(true);
    expect(config.ui.allow).toEqual(["admin", "user"]);
    expect(config.ui.refreshList).toEqual([]);
    expect(config.ui.defaultRefreshRate).toBe("30s");

    // FatSecret Configuration
    expect(config.fatsecret.clientId).toBe("");
    expect(config.fatsecret.clientSecret).toBe("");
    expect(config.fatsecret.scopes).toEqual(["basic"]);

    // Timezone
    expect(config.timezone).toBe("UTC");
  });

  it("should allow overriding default values for LogConfiguration", () => {
    const customLogLevel = new LogLevelConfiguration(LogLevel.ERROR, LogLevel.INFO);
    const customLogConfig = new LogConfiguration(customLogLevel);
    const config = new Configuration();
    config.log = customLogConfig;

    expect(config.log.level.db).toBe(LogLevel.ERROR);
    expect(config.log.level.console).toBe(LogLevel.INFO);
  });

  it("should allow overriding default values for MongoConfiguration", () => {
    const customMongoConfig = {
      url: "mongodb://customhost:27017",
      database: "customdatabase",
    };
    const config = new Configuration();
    config.mongo.url = customMongoConfig.url;
    config.mongo.database = customMongoConfig.database;

    expect(config.mongo.url).toBe("mongodb://customhost:27017");
    expect(config.mongo.database).toBe("customdatabase");
  });

  it("should allow overriding default values for UiConfiguration", () => {
    const customUiConfig = {
      enabled: false,
      allow: ["guest"],
      refreshList: ["5s", "10s"],
      defaultRefreshRate: "5s",
    };
    const config = new Configuration();
    config.ui.enabled = customUiConfig.enabled;
    config.ui.allow = customUiConfig.allow;
    config.ui.refreshList = customUiConfig.refreshList;
    config.ui.defaultRefreshRate = customUiConfig.defaultRefreshRate;

    expect(config.ui.enabled).toBe(false);
    expect(config.ui.allow).toEqual(["guest"]);
    expect(config.ui.refreshList).toEqual(["5s", "10s"]);
    expect(config.ui.defaultRefreshRate).toBe("5s");
  });
});

describe("MongoConfiguration Class", () => {
  it("should initialize with default values when no arguments are provided", () => {
    const mongoConfig = new MongoConfiguration();

    expect(mongoConfig.url).toBe("mongodb://localhost:27017");
    expect(mongoConfig.database).toBe("mydatabase");
  });

  it("should initialize with provided values for url and database", () => {
    const customUrl = "mongodb://customhost:27017";
    const customDatabase = "customdatabase";
    const mongoConfig = new MongoConfiguration(customUrl, customDatabase);

    expect(mongoConfig.url).toBe(customUrl);
    expect(mongoConfig.database).toBe(customDatabase);
  });

  it("should use the default url if only the database is provided", () => {
    const customDatabase = "customdatabase";
    const mongoConfig = new MongoConfiguration(undefined, customDatabase);

    expect(mongoConfig.url).toBe("mongodb://localhost:27017");
    expect(mongoConfig.database).toBe(customDatabase);
  });

  it("should use the default database if only the url is provided", () => {
    const customUrl = "mongodb://customhost:27017";
    const mongoConfig = new MongoConfiguration(customUrl);

    expect(mongoConfig.url).toBe(customUrl);
    expect(mongoConfig.database).toBe("mydatabase");
  });
});


describe("UiConfiguration Class", () => {
  it("should initialize with default values when no arguments are provided", () => {
    const uiConfig = new UiConfiguration();

    expect(uiConfig.enabled).toBe(true);
    expect(uiConfig.allow).toEqual([]);
    expect(uiConfig.refreshList).toEqual([]);
    expect(uiConfig.defaultRefreshRate).toBe("30s");
  });

  it("should initialize with provided values for all properties", () => {
    const customEnabled = false;
    const customAllow = ["admin", "user"];
    const customRefreshList = ["5s", "10s"];
    const customDefaultRefreshRate = "5s";
    const uiConfig = new UiConfiguration(customEnabled, customAllow, customRefreshList, customDefaultRefreshRate);

    expect(uiConfig.enabled).toBe(customEnabled);
    expect(uiConfig.allow).toEqual(customAllow);
    expect(uiConfig.refreshList).toEqual(customRefreshList);
    expect(uiConfig.defaultRefreshRate).toBe(customDefaultRefreshRate);
  });

  it("should use the default allow list if not provided", () => {
    const uiConfig = new UiConfiguration(false);

    expect(uiConfig.enabled).toBe(false);
    expect(uiConfig.allow).toEqual([]);
    expect(uiConfig.refreshList).toEqual([]);
    expect(uiConfig.defaultRefreshRate).toBe("30s");
  });

  it("should use the default refreshList if not provided", () => {
    const uiConfig = new UiConfiguration(false, ["admin"]);

    expect(uiConfig.enabled).toBe(false);
    expect(uiConfig.allow).toEqual(["admin"]);
    expect(uiConfig.refreshList).toEqual([]);
    expect(uiConfig.defaultRefreshRate).toBe("30s");
  });

  it("should use the default defaultRefreshRate if not provided", () => {
    const uiConfig = new UiConfiguration(false, ["admin"], ["5s"]);

    expect(uiConfig.enabled).toBe(false);
    expect(uiConfig.allow).toEqual(["admin"]);
    expect(uiConfig.refreshList).toEqual(["5s"]);
    expect(uiConfig.defaultRefreshRate).toBe("30s");
  });
});