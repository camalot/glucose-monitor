class Configuration {
  log: LogConfiguration;
  mongo: MongoConfiguration;
  ui: UiConfiguration;
  fatsecret: FatSecretConfiguration;

}

class LogConfiguration {
  level: LogLevelConfiguration
  
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

  constructor(url: string, database: string) {
    this.url = url;
    this.database = database;
  }
}

class UiConfiguration {
  enabled: boolean;
  allow: string[];

  constructor(enabled: boolean, allow: string[]) {
    this.enabled = enabled;
    this.allow = allow;
  }
}

class FatSecretConfiguration {
  clientId: string;
  clientSecret: string;
  scopes: ("basic" | "premier" | "barcode" | "localization")[];
  
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
