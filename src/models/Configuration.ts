export class Configuration {
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

export class LogConfiguration {
  level: LogLevelConfiguration;
  constructor(level?: LogLevelConfiguration) {
    this.level = level || new LogLevelConfiguration();
  }
}

export class LogLevelConfiguration {
  db: LogLevel = LogLevel.WARN;
  console: LogLevel = LogLevel.DEBUG;
  
  constructor(db?: LogLevel, console?: LogLevel) {
    if (db) this.db = db;
    if (console) this.console = console;
  }
}

export class MongoConfiguration {
  url: string;
  database: string;

  constructor(url?: string, database?: string) {
    this.url = url || "mongodb://localhost:27017"; // Default URL
    this.database = database || "mydatabase";
  }
}

export class UiConfiguration {
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

export class FatSecretConfiguration {
  clientId: string;
  clientSecret: string;
  scopes: ("basic" | "premier" | "barcode" | "localization")[];
  
  
  constructor(clientId?: string, clientSecret?: string, scopes: ("basic" | "premier" | "barcode" | "localization")[] = ["basic"]) {
    this.clientId = clientId || "";
    this.clientSecret = clientSecret || "";
    this.scopes = scopes;
  }
}

export enum LogLevel {
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
  MongoConfiguration,
  UiConfiguration,
  FatSecretConfiguration,
}
