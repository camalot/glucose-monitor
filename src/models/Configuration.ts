class Configuration {
  log: LogConfiguration;
  mongo: MongoConfiguration;
  ui: UiConfiguration;
  fatsecret: FatSecretConfiguration;
  timezone: string;
  constructor() {
    this.log = new LogConfiguration();
    this.mongo = new MongoConfiguration("mongodb://localhost:27017", "mydatabase");
    this.ui = new UiConfiguration(true, ["admin", "user"]);
    this.fatsecret = new FatSecretConfiguration();
    this.timezone = "UTC";
  }
}

class LogConfiguration {
  level: LogLevelConfiguration;
  constructor(level?: LogLevelConfiguration) {
    this.level = level || new LogLevelConfiguration();
  }
}

class LogLevelConfiguration {
  db: LogLevel = LogLevel.WARN;
  console: LogLevel = LogLevel.DEBUG;
  
  constructor(db?: LogLevel, console?: LogLevel) {
    if (db) this.db = db;
    if (console) this.console = console;
  }
}

class MongoConfiguration {
  url: string;
  database: string;

  constructor(url?: string, database?: string) {
    this.url = url || "mongodb://localhost:27017"; // Default URL
    this.database = database || "mydatabase";
  }
}

class UiConfiguration {
  enabled: boolean;
  allow: string[];
  refreshList: string[];
  defaultRefreshRate: string;

  constructor(enabled: boolean = true, allow: string[] = [], refreshList: string[] = [], defaultRefreshRate: string = '30s') {
    this.enabled = enabled;
    this.allow = allow;
    this.refreshList = refreshList;
    this.defaultRefreshRate = defaultRefreshRate;
  }
}

class FatSecretConfiguration {
  clientId: string;
  clientSecret: string;
  scopes: ("basic" | "premier" | "barcode" | "localization")[];
  
  
  constructor(clientId?: string, clientSecret?: string, scopes: ("basic" | "premier" | "barcode" | "localization")[] = ["basic"]) {
    this.clientId = clientId || "";
    this.clientSecret = clientSecret || "";
    this.scopes = scopes;
  }
}

enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  FATAL = "FATAL",
  DEBUG = "DEBUG",
  TRACE = "TRACE",
}

export default {
  Configuration,
  LogConfiguration,
  LogLevelConfiguration,
  LogLevel,
  
}
