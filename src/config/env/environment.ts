import * as dotenv from 'dotenv';

dotenv.config();

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

const uiEnabled = getEnvVarBooleanDefault('GM_UI_ENABLED', true);

const config = {
  log: {
    level: {
      db: getEnvVarString('GM_LOG_LEVEL', 'WARN').toUpperCase(),
      console: getEnvVarString('GM_LOG_LEVEL_CONSOLE', 'DEBUG').toUpperCase(),
    },
  },
  mongo: {
    url: buildMongoUrl(),
    database: getEnvVarString('GM_MONGO_DATABASE', 'shortener_dev'),
  },
  ui: {
    enabled: uiEnabled,
    allow: getEnvVarList('GM_UI_ALLOWED_HOSTS', uiEnabled ? ['*'] : []),
  },
  fatsecret: {
    clientId: getEnvVarString('GM_FATSECRET_CLIENT_ID', ''),
    clientSecret: getEnvVarString('GM_FATSECRET_CLIENT_SECRET', ''),
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
};

export default config;


// require('dotenv').config();

// function stripQuotes(str) {
//   return str.replace(/^"(.*)"$/, '$1');
// }

// function buildMongoUrl() {
//   const mUrl = stripQuotes(getEnvVarString('GM_MONGODB_URL', ''));
//   if (mUrl) {
//     return mUrl;
//   } else {
//     const host = stripQuotes(getEnvVarString('GM_MONGODB_HOST', 'localhost'));
//     const port = stripQuotes(getEnvVarString('GM_MONGODB_PORT', '27017'));
//     const user = stripQuotes(getEnvVarString('GM_MONGODB_USERNAME', ''));
//     const pass = encodeURIComponent(stripQuotes(getEnvVarString('GM_MONGODB_PASSWORD', '')));
//     const authSource = stripQuotes(getEnvVarString('GM_MONGODB_AUTHSOURCE', 'admin'));
//     let auth = '';

//     if (host && port) {
//       if (process.env.GM_MONGODB_USERNAME && pass) {
//         auth = `${user}:${pass}@`;
//       } 
//       const url = `mongodb://${auth}${host}:${port}/${authSource}`;
//       const url_stripped = `mongodb://**********:**********@${host}:${port}/${authSource}`;
//       console.log(`Building MongoDB URL: ${url_stripped}`);
//       return url;
//     }
//   }
//   console.log(`using default mongo database URL`);
//   return 'mongodb://localhost:27017/admin';
// }

// function getEnvVarBooleanDefault(envVar, defaultValue) {
//   if (process.env[envVar] === undefined) {
//     return defaultValue;
//   }
//   return process.env[envVar].toLowerCase() === 'true';
// }

// function getEnvVarList(envVar, defaultValue) {
//   if (process.env[envVar]) {
//     return process.env[envVar].split(',').map(h => h.trim());
//   }
//   return defaultValue;
// }

// function getEnvVarString(envVar, defaultValue) {
//   if (process.env[envVar]) {
//     return process.env[envVar];
//   }
//   return defaultValue;
// }

// function getEnvVarInt(envVar, defaultValue) {
//   if (process.env[envVar]) {
//     let result = parseInt(process.env[envVar]);
//     if (isNaN(result)) {
//       return defaultValue;
//     } 
//     return result;
//   }
//   return defaultValue;
// }

// const ui_enabled = getEnvVarBooleanDefault('GM_UI_ENABLED', true);

// module.exports = {
//   log: {
//     level: {
//       db: getEnvVarString('GM_LOG_LEVEL', 'WARN').toUpperCase(),
//       console: getEnvVarString('GM_LOG_LEVEL_CONSOLE', 'DEBUG').toUpperCase(),
//     },
//   },
//   mongo: {
//     url: buildMongoUrl(),
//     database: getEnvVarString('GM_MONGO_DATABASE', 'shortener_dev'),
//   },
//   ui: {
//     enabled: ui_enabled,
//     allow: getEnvVarList('GM_UI_ALLOWED_HOSTS', ui_enabled ? ['*'] : []),
//   },
//   fatsecret: {
//     clientId: getEnvVarString('GM_FATSECRET_CLIENT_ID', ''),
//     clientSecret: getEnvVarString('GM_FATSECRET_CLIENT_SECRET', ''),
//   },
//   metrics: {
//     requireToken: getEnvVarBooleanDefault('GM_METRICS_REQUIRE_TOKEN', true),
//   },
//   tokens: {
//     prefix: getEnvVarString('GM_TOKEN_PREFIX', 'gm_'),
//     length: getEnvVarInt('GM_TOKEN_LENGTH', 36),
//     create: {
//       enabled: getEnvVarBooleanDefault('GM_ENABLE_TOKEN_CREATE', true),
//     },
//     required: getEnvVarBooleanDefault('GM_TOKEN_REQUIRED', true)
//   }
// };
