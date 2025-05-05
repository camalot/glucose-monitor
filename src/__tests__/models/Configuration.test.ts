import {Configuration, LogConfiguration, LogLevel, LogLevelConfiguration} from "../../models/Configuration";


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