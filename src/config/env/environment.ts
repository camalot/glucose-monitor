import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const appPackage = JSON.parse(fs.readFileSync(getPackageJsonPath(), 'utf-8'));

function stripQuotes(str: string): string {
  return str.replace(/^"(.*)"$/, '$1');
}

function buildMongoUrl(): string {
  const mUrl = stripQuotes(getEnvVarString('GM_MONGODB_URL', ''));
  if (mUrl) {
    return mUrl;
  } else {
    const host = stripQuotes(getEnvVarString('GM_MONGODB_HOST', 'localhost'));
    const port = stripQuotes(getEnvVarString('GM_MONGODB_PORT', '27017'));
    const user = stripQuotes(getEnvVarString('GM_MONGODB_USERNAME', ''));
    const pass = encodeURIComponent(stripQuotes(getEnvVarString('GM_MONGODB_PASSWORD', '')));
    const authSource = stripQuotes(getEnvVarString('GM_MONGODB_AUTHSOURCE', 'admin'));
    let auth = '';

    if (host && port) {
      if (process.env.GM_MONGODB_USERNAME && pass) {
        auth = `${user}:${pass}@`;
      }
      const url = `mongodb://${auth}${host}:${port}/${authSource}`;
      const urlStripped = `mongodb://**********:**********@${host}:${port}/${authSource}`;
      console.log(`Building MongoDB URL: ${urlStripped}`);
      return url;
    }
  }
  console.log(`Using default MongoDB URL`);
  return 'mongodb://localhost:27017/admin';
}

function getEnvVarBooleanDefault(envVar: string, defaultValue: boolean): boolean {
  if (process.env[envVar] === undefined) {
    return defaultValue;
  }
  return process.env[envVar].toLowerCase() === 'true';
}

function getEnvVarList(envVar: string, defaultValue: string[]): string[] {
  if (process.env[envVar]) {
    return process.env[envVar].split(',').map((h) => h.trim());
  }
  return defaultValue;
}

function getEnvVarString(envVar: string, defaultValue: string): string {
  if (process.env[envVar]) {
    return process.env[envVar];
  }
  return defaultValue;
}

function getEnvVarInt(envVar: string, defaultValue: number): number {
  if (process.env[envVar]) {
    const result = parseInt(process.env[envVar]);
    if (isNaN(result)) {
      return defaultValue;
    }
    return result;
  }
  return defaultValue;
}

function getPackageJsonPath(): string {
  return path.resolve(__dirname, '../../package.json');
}

function getPackageVar(key: string, defaultValue: string): string {
  return appPackage[key] || defaultValue;
}

const uiEnabled = getEnvVarBooleanDefault('GM_UI_ENABLED', true);

const config = {
  app: {
    version: getPackageVar('version', '1.0.0'),
    buildSha: getPackageVar('buildSha', 'unknown'),
    buildRef: getPackageVar('buildRef', 'unknown'),
    buildDate: getPackageVar('buildDate', 'unknown'),
  },
  log: {
    level: {
      db: getEnvVarString('GM_LOG_LEVEL', 'WARN').toUpperCase(),
      console: getEnvVarString('GM_LOG_LEVEL_CONSOLE', 'DEBUG').toUpperCase(),
    },
  },
  mongo: {
    url: buildMongoUrl(),
    database: getEnvVarString('GM_MONGO_DATABASE', 'glucose_monitor_dev'),
  },
  chatgpt: {
    apiKey: getEnvVarString('GM_OPENAI_API_KEY', ''),
    apiUrl: getEnvVarString('GM_OPENAI_API_URL', 'https://api.openai.com/v1/chat/completions'),
    model: getEnvVarString('GM_OPENAI_MODEL', 'gpt-4o'),
    verifySSL: getEnvVarBooleanDefault('GM_OPENAI_VERIFY_SSL', true),
  },
  ui: {
    enabled: uiEnabled,
    allow: getEnvVarList('GM_UI_ALLOWED_HOSTS', uiEnabled ? ['*'] : []),
    defaultRefreshRate: getEnvVarString('GM_DEFAULT_REFRESH_RATE', '30s'),
    refreshList: getEnvVarList('GM_REFRESH_LIST', ['Off', '30s', '45s', '1m', '2m', '5m', '10m']),
    defaultTimeframe: getEnvVarString('GM_DEFAULT_TIMEFRAME', '90d'),
  },
  fatsecret: {
    clientId: getEnvVarString('GM_FATSECRET_CLIENT_ID', ''),
    clientSecret: getEnvVarString('GM_FATSECRET_CLIENT_SECRET', ''),
    scopes: ['basic', 'premier'] as ("basic" | "premier" | "barcode" | "localization")[],
  },
  metrics: {
    requireToken: getEnvVarBooleanDefault('GM_METRICS_REQUIRE_TOKEN', true),
  },
  tokens: {
    prefix: getEnvVarString('GM_TOKEN_PREFIX', 'gm_'),
    length: getEnvVarInt('GM_TOKEN_LENGTH', 36),
    create: {
      enabled: getEnvVarBooleanDefault('GM_ENABLE_TOKEN_CREATE', true),
    },
    required: getEnvVarBooleanDefault('GM_TOKEN_REQUIRED', true),
  },
  timezone: getEnvVarString('TZ', getEnvVarString('GM_TIMEZONE', 'America/Chicago')),
};

export default config;
